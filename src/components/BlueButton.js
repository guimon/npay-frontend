import React, { Component } from 'react'
import PropTypes from "prop-types";

import {MuiThemeProvider, withStyles} from '@material-ui/core/styles/index';
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';

import NpayThemes from "../helpers/NpayThemes";

const styles = theme => ({
  button: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  progress: {
    color: '#455be7',
    marginRight: 10
  }
});

class BlueButton extends Component {
  getBgColor = () => {
    return ((this.props.enabled && !this.props.loading) ? '#455be7' : '#ddd');
  };

  getColor = () => {
    return ((this.props.enabled && !this.props.loading) ? '#fff' : '#00000044');
  };

  render() {
    const { classes, label, onClick, enabled, loading } = this.props;

    return (
      <MuiThemeProvider theme={NpayThemes.blueButtonTheme}>
        <Button fullWidth variant="contained" color="primary" size="large" className={classes.button} onClick={onClick} disabled={!enabled || loading} style={{ backgroundColor: this.getBgColor()}}>
          {loading && <CircularProgress className={classes.progress} size={16} thickness={5} /> }
          <Typography variant="subtitle1" style={{ color: this.getColor() }}>
            {label}
          </Typography>
        </Button>
      </MuiThemeProvider>
    )
  }
}

BlueButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool
};

BlueButton.defaultProps = {
  loading: false
};

export default withStyles(styles)(BlueButton);
