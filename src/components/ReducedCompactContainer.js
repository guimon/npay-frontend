import React, { Component } from 'react'
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    minHeight: '100vh',
    paddingBottom: '10vh'
  },
  logo: {
    width: '100%',
    paddingBottom: '10vh'
  },
  innerGrid: {
    display: 'flex',
    flexDirection: 'column',
  }
});

class ReducedCompactContainer extends Component {
  render() {
    const { classes, children, showLogo } = this.props;

    return (
        <Grid container className={classes.root} direction="column" alignItems="center">
          <Grid item xs={12} sm={8} md={4} lg={3} className={classes.innerGrid}>
            {showLogo && <img className={classes.logo} src="/npay_logo.png" alt={"logo"}/>}
            {children}
          </Grid>
        </Grid>
    )
  }
}

ReducedCompactContainer.propTypes = {
  showLogo: PropTypes.bool
};

ReducedCompactContainer.defaultProps = {
  showLogo: true
};

export default withStyles(styles)(ReducedCompactContainer);
