import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { Typography } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  shaded: {
    backgroundColor: '#f3f6f8',
  },
  root: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
  }
});

class SectionHeader extends Component {
  render() {
    const { classes, label } = this.props;

    return (
      <div className={classes.shaded}>
        <Typography variant="overline" color="secondary" className={classes.root}>
          {label}
        </Typography>
      </div>
    )
  }
}

SectionHeader.propTypes = {
  label: PropTypes.string.isRequired,
};

export default withStyles(styles)(SectionHeader);