import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    minHeight: '100vh',
    paddingTop: '10vh',
    paddingBottom: '10vh'
  },
  logo: {
    width: '100%',
    paddingBottom: '10vh'
  },
  innerGrid: {
    justifyContent: 'space-evenly',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.only('xs')]: {
      minHeight: '60vh',
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: '30vh',
    }
  }
});

class ReducedContainer extends Component {
  render() {
    const { classes, children, showLogo } = this.props;

    return (
        <Grid container className={classes.root} justify="space-evenly"
              direction="column" alignItems="center">
          <Grid item xs={10} sm={6} md={4} lg={3} className={classes.innerGrid}>
            {showLogo && <img className={classes.logo} src="/npay_logo.png" alt={"logo"}/>}
            {children}
          </Grid>
        </Grid>
    )
  }
};

ReducedContainer.propTypes = {
  showLogo: PropTypes.bool
};

ReducedContainer.defaultProps = {
  showLogo: true
};

export default withStyles(styles)(ReducedContainer);
