import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';
import {Divider} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  label: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  inner: {
    display: 'flex',
    justifyContent: 'center',
  }
});

class FormRowFullWidth extends Component {
  render() {
    const { classes, children } = this.props;

    return (
        <React.Fragment>
          <Grid container className={classes.root} direction="row" alignItems="center">
            <Grid item xs={12} className={classes.inner}>
              {children}
            </Grid>
          </Grid>
          <Divider color="secondary"/>
        </React.Fragment>
    )
  }
}

export default withStyles(styles)(FormRowFullWidth);