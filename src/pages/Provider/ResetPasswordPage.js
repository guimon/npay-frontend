import React, { Component } from 'react'
import queryString from 'query-string/index'
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

class ResetPasswordPage extends Component {
  state = {
    new_password: '',
    confirm_password: '',
    showPassword: false,
    showPasswordConfirmation: false
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleClickShowPasswordConfirmation = () => {
    this.setState({ showPasswordConfirmation: !this.state.showPasswordConfirmation });
  };

  onNewPasswordChange = (event) => {
    if (event.target.value) {
      this.setState({new_password: event.target.value})
    } else {
      this.setState({new_password: ''})
    }
  };

  onConfirmPasswordChange = (event) => {
    if (event.target.value) {
      this.setState({confirm_password: event.target.value})
    } else {
      this.setState({confirm_password: ''})
    }
  };

  newPasswordMatch = () => {
    return this.state.new_password === this.state.confirm_password &&
        (this.state.new_password === '' || this.state.new_password.length >= 6);
  };

  catchReturn = (event) => {
    if (event.key === 'Enter') {
      this.saveNewPassword();
    }
  };

  successSNewPassword = () => {
    openSnackbar({ message: 'New password set successfully! Please login now!',
      variant: 'success', timeout: 3000 });

    setTimeout(() => {
      this.props.history.push("/provider");
    }, 3000);
  };

  failedNewPassword = () => {
    openSnackbar({ message: 'New password set failed!', variant: 'error', timeout: 3000 });
  };

  saveNewPassword = () => {
    const values = queryString.parse(this.props.location.search);

    ProviderAuthService.saveNewPassword(this.state.email, this.state.new_password,
        values.reset_password_token, this.successSNewPassword, this.failedNewPassword);
  };

  render() {
    const { classes } = this.props;

    return (
      <ReducedContainer>
        <Typography color="secondary">
          Create your new password here with at least 6 characters
        </Typography>
        <TextField
            label="New password"
            margin="normal"
            variant="outlined"
            fullWidth
            type={this.state.showPassword ? 'text' : 'password'}
            onChange={this.onNewPasswordChange}
            value={this.state.new_password}
            error={!this.newPasswordMatch()}
            autoFocus
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
        <TextField
            label="Confirm new password"
            margin="normal"
            variant="outlined"
            fullWidth
            type={this.state.showPasswordConfirmation ? 'text' : 'password'}
            onChange={this.onConfirmPasswordChange}
            value={this.state.confirm_password}
            error={!this.newPasswordMatch()}
            onKeyPress={this.catchReturn}
            InputProps={{
              endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPasswordConfirmation}
                    >
                      {this.state.showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
              ),
            }}
        />
        <Button
            className={classes.button}
            classes={{label: classes.buttonLabel}}
            fullWidth color="primary"
            variant="extendedFab"
            margin="normal"
            onClick={this.saveNewPassword}
        >
          <Typography>Save new password</Typography>
        </Button>
        <div className={classes.bottomNav}>
          <RouterLink to="/" className={classes.bottomLink}>
            <Typography color="secondary">Back</Typography>
          </RouterLink>
        </div>
        <Notifier />
      </ReducedContainer>
    )
  }
}

export default withStyles(styles)(ResetPasswordPage);