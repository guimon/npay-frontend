import React, { Component } from 'react'
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import {Divider} from "@material-ui/core";

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

class BillEventRow extends Component {
  render() {
    const { classes, billEvent } = this.props;

    return (
        <React.Fragment>
          <Grid container className={classes.root}
                direction="row" alignItems="center">
            <Grid item xs={4} sm={3} md={2} lg={2}>
              <Typography className={classes.value}>{billEvent.attributes.created_at_formatted}</Typography>
            </Grid>
            <Grid item xs={8} sm={9} md={10} lg={10}>
              <Typography color="secondary">{billEvent.attributes.bill_status_formatted}</Typography>
            </Grid>
          </Grid>
          <Divider color="secondary"/>
        </React.Fragment>
    )
  }
}

BillEventRow.propTypes = {
  billEvent: PropTypes.object.isRequired,
};

export default withStyles(styles)(BillEventRow);