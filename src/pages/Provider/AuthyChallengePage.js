import React, { Component } from 'react'
import {Link as RouterLink, withRouter} from "react-router-dom";

import { withStyles } from '@material-ui/core/styles/index';
import Typography from "@material-ui/core/Typography/index";
import TextField from '@material-ui/core/TextField/index';
import Button from '@material-ui/core/Button/index';

import ProviderAuthService from '../../services/ProviderAuthService';
import ReducedContainer from "../../components/ReducedContainer";
import Notifier, {openSnackbar} from "../../components/Notifier";

const styles = theme => ({
  topNav: {
    marginBottom: '10vh'
  },
  bottomNav: {
    marginTop: '10vh'
  },
  bottomLink: {
    cursor: 'pointer',
    alignSelf: 'start',
    fontVariant: 'all-small-caps',
    textDecoration: 'none',
  }
});

class AuthyChallengePage extends Component {
  state = {
    verificationCode: ''
  };

  verificationCodeChange = (event) => {
    if (event.target.value) {
      this.setState({verificationCode: event.target.value})
    } else {
      this.setState({verificationCode: ''})
    }
  };

  validateVerificationCode = () => {
    return this.state.verificationCode.length === 6 || this.state.verificationCode.length === 0
  };

  successfulVerification = () => {
    this.props.history.push("/provider/dashboard");
  };

  failedVerification = () => {
    openSnackbar({ message: 'Validation failed, please try again!', variant: 'error',
      timeout: 3000 });
  };

  verifyCode = () => {
    ProviderAuthService.verifyAuthy(this.state.verificationCode, this.successfulVerification, this.failedVerification);
  };

  successfulResend = () => {
    openSnackbar({ message: 'Code sent successfully!', variant: 'success', timeout: 3000 });
  };

  failedResend = () => {
    openSnackbar({ message: 'Failure sending code. Please try again later!', variant: 'error', timeout: 3000 });
  };

  resendCode = () => {
    ProviderAuthService.resendAuthy(this.successfulResend, this.failedResend);
  };

  catchReturn = (event) => {
    if (event.key === 'Enter') {
      this.verifyCode();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <ReducedContainer>
        <Typography variant="overline" className={classes.topNav}>Let's get you verified!</Typography>
        <Typography variant="body1">We've sent a verification code to your mobile phone. Enter it below</Typography>
        <TextField
          label="Verification code"
          margin="normal"
          variant="outlined"
          type="number"
          fullWidth
          onChange={this.verificationCodeChange}
          value={this.state.verificationCode}
          error={!this.validateVerificationCode()}
          onKeyPress={this.catchReturn}
          autoFocus
        />
        <Button
            className={classes.button}
            fullWidth color="primary"
            variant="extendedFab"
            margin="normal"
            onClick={this.verifyCode}
        >
          <Typography>Verify</Typography>
        </Button>
        <div className={classes.bottomNav}>
          <RouterLink onClick={this.resendCode} className={classes.bottomLink}>
            <Typography color="secondary">Didn't get it? Resend now</Typography>
          </RouterLink>
        </div>
        <Notifier />
      </ReducedContainer>
    )
  }
};

export default withStyles(styles)(withRouter(AuthyChallengePage));