import React, { Component } from 'react'
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';

import NpayThemes from "../helpers/NpayThemes";

const styles = theme => ({
  root: {
    width: '100%',
    minHeight: '100vh'
  },
  logo: {
    maxWidth: '50%',
    paddingBottom: '3vh',
    paddingTop: '3vh',
  },
  innerGrid: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: '3vh',
    color: '#3D3E4D',
    textAlign: 'center',
  }
});

class RoundedContainer extends Component {
  render() {
    const { classes, children, showLogo } = this.props;

    return (
        <MuiThemeProvider theme={NpayThemes.lightTheme}>
          <Grid container className={classes.root} direction="column" alignItems="center">
            {showLogo &&
              <Grid item xs={12} sm={6} md={4} lg={3} style={{textAlign: 'center'}}>
                <img className={classes.logo} src="/npay_logo.png" alt={"logo"}/>
              </Grid>
            }
            <Grid item xs={12} sm={6} md={4} lg={3} className={classes.innerGrid}>
              {children}
            </Grid>
          </Grid>
        </MuiThemeProvider>
    )
  }
};

RoundedContainer.propTypes = {
  showLogo: PropTypes.bool
};

RoundedContainer.defaultProps = {
  showLogo: true
};

export default withStyles(styles)(RoundedContainer);
