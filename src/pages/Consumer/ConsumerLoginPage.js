import React, { Component } from 'react'
import { Redirect, withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles/index';
import TextField from '@material-ui/core/TextField/index';
import Button from '@material-ui/core/Button/index';
import Typography from '@material-ui/core/Typography/index';
import Link from '@material-ui/core/Link';

import ConsumerService from '../../services/ConsumerService';
import ReducedContainer from "../../components/ReducedContainer";
import Notifier, { openSnackbar } from '../../components/Notifier';
import PhoneMaskedInput from "../../components/PhoneMaskedInput";
import DateMaskedInput from "../../components/DateMaskedInput";
import Validator from "../../helpers/Validator";

const styles = theme => ({
  button: {
    marginTop: 2 * theme.spacing.unit
  },
  bottomNav: {
    marginTop: '10vh'
  },
});

class ConsumerLoginPage extends Component {
  state = {
    phone: '',
    date_of_birth: '',
  };

  hydrateStateWithLocalStorage = () => {
    this.setState(state => ({ phone: localStorage.getItem('phone') || '' }));
    this.setState(date_of_birth => ({ date_of_birth: localStorage.getItem('date_of_birth') || '' }));
  };

  componentWillMount() {
    this.hydrateStateWithLocalStorage();
  }

  catchReturn = (event) => {
    if (event.key === 'Enter') {
      this.sendSms();
    }
  };

  successfulLoginSms = (response) => {
    this.props.history.push("/consumer/validate_sms");
  };

  failedLoginSms = () => {
    openSnackbar({ message: 'Could not find a record for this phone and date of birth. Check the information and try again.',
      variant: 'error', timeout: 6000 });
  };

  sendSms = () => {
    ConsumerService.sendLoginSms(this.state.phone, this.state.date_of_birth,
        this.successfulLoginSms, this.failedLoginSms);
  };

  onPhoneChange = (event) => {
    localStorage.setItem('phone', event.target.value);
    if (event.target.value) {
      this.setState({phone: event.target.value})
    } else {
      this.setState({phone: ''})
    }
  };

  dateOfBirthChange = (event) => {
    localStorage.setItem('date_of_birth', event.target.value);
    if (event.target.value) {
      this.setState({date_of_birth: event.target.value})
    } else {
      this.setState({date_of_birth: ''})
    }
  };

  render() {
    const {classes} = this.props;
    return (
        <React.Fragment>
        { ConsumerService.loggedIn() && <Redirect to="/consumer/dashboard" /> }
          {!ConsumerService.loggedIn() &&
            <ReducedContainer>
              <TextField
                  autoFocus
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  label="Your phone"
                  value={this.state.phone}
                  onChange={this.onPhoneChange}
                  onKeyPress={this.catchReturn}
                  InputProps={{
                    inputComponent: PhoneMaskedInput
                  }}
              />
              <TextField
                  label="Date of birth"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  onChange={this.dateOfBirthChange}
                  value={this.state.date_of_birth}
                  onKeyPress={this.catchReturn}
                  error={!Validator.validDateOfBirth(this.state.date_of_birth)}
                  InputProps={{
                    inputComponent: DateMaskedInput
                  }}
              />
              <Button
                  className={classes.button}
                  fullWidth
                  color="primary"
                  variant="extendedFab"
                  margin="normal"
                  onClick={this.sendSms}
              >
                <Typography>Log In</Typography>
              </Button>
              <div className={classes.bottomNav}>
                <Typography color="secondary" align="center">
                  2019, Npay, Corp.
                  | <Link className={classes.bottomLink} color="secondary" underline="none">Terms of
                  Use</Link>
                </Typography>
              </div>
              <Notifier/>
            </ReducedContainer>
          }
        </React.Fragment>
    )
  }
}

export default withStyles(styles)(withRouter(ConsumerLoginPage));
