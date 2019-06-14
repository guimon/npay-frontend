import React, { Component } from 'react'
import { Link as RouterLink, withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles/index';
import TextField from '@material-ui/core/TextField/index';
import Button from '@material-ui/core/Button/index';
import Typography from '@material-ui/core/Typography/index';

import ConsumerService from '../../services/ConsumerService';
import ReducedContainer from "../../components/ReducedContainer";
import Notifier, { openSnackbar } from '../../components/Notifier';

const styles = theme => ({
  button: {
    marginTop: 2 * theme.spacing.unit
  },
  bottomNav: {
    marginTop: '10vh'
  },
  bottomLink: {
    cursor: 'pointer',
    alignSelf: 'start',
    textDecoration: 'none',
  }
});

class ConsumerValidateSmsPage extends Component {
  state = {
    token: ''
  };

  catchReturn = (event) => {
    if (event.key === 'Enter') {
      this.validateSms();
    }
  };

  successfulVerifySms = (response) => {
    this.props.history.push("/consumer/dashboard");
  };

  failedVerifySms = () => {
    openSnackbar({ message: 'Invalid verification code! Please try again.',
      variant: 'error', timeout: 3000 });
  };

  validateSms = () => {
    ConsumerService.verifySms(localStorage.getItem('phone'), this.state.token,
        this.successfulVerifySms, this.failedVerifySms);
  };

  onTokenChange = (event) => {
    if (event.target.value) {
      this.setState({token: event.target.value})
    } else {
      this.setState({token: ''})
    }
  };

  render() {
    const {classes} = this.props;
    return (
        <ReducedContainer>
          <TextField
              autoFocus
              fullWidth
              margin="normal"
              variant="outlined"
              label="Verification code"
              value={this.state.token}
              onChange={this.onTokenChange}
              onKeyPress={this.catchReturn}
          />
          <Button
              className={classes.button}
              fullWidth
              color="primary"
              variant="extendedFab"
              margin="normal"
              onClick={this.validateSms}
          >
            <Typography>Verify</Typography>
          </Button>
          <div className={classes.bottomNav}>
            <Typography color="secondary" align="center">
              Didn't get it?
              <RouterLink to="/" className={classes.bottomLink}>
                <Typography color="primary" inline={true}> Resend it now</Typography>
              </RouterLink>
            </Typography>
          </div>
          <Notifier />
        </ReducedContainer>
    )
  }
}

export default withStyles(styles)(withRouter(ConsumerValidateSmsPage));