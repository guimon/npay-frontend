import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {Divider, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 16
  },
  label: {
    paddingLeft: 8,
    paddingRight: 8,
  },
});

class FormRow extends Component {
  render() {
    const { classes, label, children } = this.props;

    return (
        <React.Fragment>
          <Grid container className={classes.root}
                direction="row" alignItems="center">
            <Grid item xs={6} sm={3} md={2} lg={2}>
              <Typography className={classes.label} color="secondary">{label}</Typography>
            </Grid>
            <Grid item xs={6} sm={9} md={10} lg={10}>
              {children}
            </Grid>
          </Grid>
          <Divider color="secondary"/>
        </React.Fragment>
    )
  }
}

FormRow.propTypes = {
  label: PropTypes.string.isRequired
};

export default withStyles(styles)(FormRow);