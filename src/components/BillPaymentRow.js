import React, { Component } from 'react'
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import {Divider} from "@material-ui/core";
import Formatter from "../helpers/Formatter";

const styles = () => ({
  root: {
    flexGrow: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
  },
  value: {
    color: '#3D3E4D'
  },
});

class BillPaymentRow extends Component {
  render() {
    const { classes, payment } = this.props;

    return (
        <React.Fragment>
          <Grid container className={classes.root}
                direction="row" alignItems="center">
            <Grid item xs={4}>
              <Typography color="secondary">{Formatter.formatDateTimeSimple(payment.attributes.paid_at)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.value}>{Formatter.formatMoney(payment.attributes.amount)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography color="secondary">{payment.attributes.status}</Typography>
            </Grid>
          </Grid>
          <Divider color="secondary"/>
        </React.Fragment>
    )
  }
}

BillPaymentRow.propTypes = {
  payment: PropTypes.object.isRequired,
};

export default withStyles(styles)(BillPaymentRow);