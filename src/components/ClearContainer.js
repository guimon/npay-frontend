import React, { Component } from 'react'

import { withStyles } from "@material-ui/core";
import { MuiThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import NpayThemes from "../helpers/NpayThemes";

const styles = () => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: '#fff'
  },
});

class ClearContainer extends Component {
  render() {
    const { classes, children } = this.props;

    return (
        <MuiThemeProvider theme={NpayThemes.lightTheme}>
          <Grid container className={classes.root} direction="column">
              {children}
          </Grid>
        </MuiThemeProvider>
    )
  }
};

export default withStyles(styles)(ClearContainer);
