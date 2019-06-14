import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import validator from 'email-validator/index';
import { Link as RouterLink } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles/index';
import TextField from '@material-ui/core/TextField/index';
import Button from '@material-ui/core/Button/index';
import Typography from '@material-ui/core/Typography/index';
import InputAdornment from '@material-ui/core/InputAdornment/index';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton/index';

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

class LoginPage extends Component {
  state = {
    email: '',
    password: '',
    showPassword: false
  };

  validateEmail = () => {
    return this.state.email === '' || validator.validate(this.state.email);
  };

  validatePassword = () => {
    return this.state.password === '' || this.state.password.length >= 6;
  };

  hydrateStateWithLocalStorage = () => {
    this.setState(state => ({ email: localStorage.getItem('email') || '' }));
  };

  componentDidMount() {
    if (ProviderAuthService.loggedIn()) {
      this.props.history.push("/provider/dashboard");
    } else {
      this.hydrateStateWithLocalStorage();
    }
  }

  catchReturn = (event) => {
    if (event.key === 'Enter') {
      this.tryLogin();
    }
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  successfulLogin = (response) => {
    openSnackbar({ message: 'Login successful!', variant: 'success', timeout: 3000 });
    this.props.history.push("/provider/dashboard");
  };

  failedLogin = () => {
    openSnackbar({ message: 'Login failed!', variant: 'error', timeout: 3000 });
  };

  tryLogin = () => {
    ProviderAuthService.login(this.state.email, this.state.password, this.successfulLogin, this.failedLogin);
  };

  onEmailChange = (event) => {
    localStorage.setItem('email', event.target.value);
    if (event.target.value) {
      this.setState({email: event.target.value})
    } else {
      this.setState({email: ''})
    }
  };

  onPasswordChange = (event) => {
    if (event.target.value) {
      this.setState({password: event.target.value})
    } else {
      this.setState({password: ''})
    }
  };

  render() {
    const {classes} = this.props;
    return (
      <ReducedContainer>
        <TextField
          label="Your email"
          margin="normal"
          variant="outlined"
          fullWidth
          onChange={this.onEmailChange}
          value={this.state.email}
          error={!this.validateEmail()}
        />
        <TextField
          label="Password"
          type={this.state.showPassword ? 'text' : 'password'}
          margin="normal"
          variant="outlined"
          fullWidth
          onChange={this.onPasswordChange}
          onKeyPress={this.catchReturn}
          error={!this.validatePassword()}
          InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
            ),
          }}
        />
        <Button
          className={classes.button}
          fullWidth
          color="primary"
          variant="extendedFab"
          margin="normal"
          onClick={this.tryLogin}
        >
          <Typography>Sign In</Typography>
        </Button>
        <div className={classes.bottomNav}>
          <RouterLink to="/provider/forgot/" className={classes.bottomLink}>
            <Typography color="secondary">Forgot Password?</Typography>
          </RouterLink>
        </div>
        <Notifier />
      </ReducedContainer>
    )
  }
};

export default withStyles(styles)(withRouter(LoginPage));