import React, { Component } from 'react'
import { Link as RouterLink } from "react-router-dom";
import validator from 'email-validator/index';

import { withStyles } from '@material-ui/core/styles/index';
import TextField from '@material-ui/core/TextField/index';
import Button from '@material-ui/core/Button/index';
import Typography from '@material-ui/core/Typography/index';

import ProviderAuthService from '../../services/ProviderAuthService';
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
    fontVariant: 'all-small-caps',
    textDecoration: 'none',
  }
});

class ForgotPage extends Component {
  state = {
    email: ''
  };

  componentDidMount() {
    this.hydrateStateWithLocalStorage();
  }

  catchReturn = (event) => {
    if (event.key === 'Enter') {
      this.requestPasswordReset();
    }
  };

  validateEmail = () => {
    return this.state.email === '' || validator.validate(this.state.email);
  };

  onEmailChange = (event) => {
    localStorage.setItem('email', event.target.value);
    if (event.target.value) {
      this.setState({email: event.target.value})
    } else {
      this.setState({email: ''})
    }
  };

  successfulReset = () => {
    let message = "If your email address exists in our database, you will receive a password " +
        "recovery link at your email address in a few minutes.";
    openSnackbar({ message: message, variant: 'success', timeout: 6000});

    setTimeout(() => {
      this.props.history.push("/provider");
    }, 6000);
  };

  failedReset = () => {
    openSnackbar({ message: 'Request failed!', variant: 'error', timeout: 3000 });
  };

  requestPasswordReset = () => {
    ProviderAuthService.resetPassword(this.state.email, this.successfulReset, this.failedReset);
  };

  hydrateStateWithLocalStorage = () => {
    this.setState({ email: localStorage.getItem('email') || '' });
  };

  render() {
    const { classes } = this.props;

    return (
      <ReducedContainer>
        <Typography color="secondary">Type your email to request a password recovery link in your email</Typography>
        <TextField
            label="Your email"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            fullWidth
            onChange={this.onEmailChange}
            value={this.state.email}
            onKeyPress={this.catchReturn}
            error={!this.validateEmail()}
            autoFocus
        />
        <Button
            className={classes.button}
            classes={{label: classes.buttonLabel}}
            fullWidth color="primary"
            variant="extendedFab"
            margin="normal"
            onClick={this.requestPasswordReset}
        >
          <Typography>Send instructions</Typography>
        </Button>
        <div className={classes.bottomNav}>
          <div className={classes.bottomNav}>
            <RouterLink to="/" className={classes.bottomLink}>
              <Typography color="secondary">Back</Typography>
            </RouterLink>
          </div>
        </div>
        <Notifier />
      </ReducedContainer>
    )
  }
}

export default withStyles(styles)(ForgotPage);