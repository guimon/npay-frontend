import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles/index';
import { withRouter} from "react-router-dom";

import Typography from "@material-ui/core/Typography/index";
import TextField from "@material-ui/core/TextField/index";
import Button from "@material-ui/core/Button/index";

import CheckoutService from '../../services/CheckoutService';
import ReducedContainer from "../../components/ReducedContainer";
import DateMaskedInput from "../../components/DateMaskedInput";
import Notifier, { openSnackbar } from "../../components/Notifier";
import HelpBar from "../../components/HelpBar";
import Validator from "../../helpers/Validator";
import ConsumerService from "../../services/ConsumerService";

const styles = theme => ({
  topNav: {
    marginBottom: '10vh'
  },
});

class CheckoutDobValidationPage extends Component {
  state = {
    date_of_birth: ''
  };

  componentWillMount() {
    CheckoutService.clicked(this.props.match.params.slug);

    if (ConsumerService.loggedIn()) {
      this.props.history.replace("/b/" + this.props.match.params.slug + "/options");
    } else {
      this.hydrateStateWithLocalStorage();
    }
  }

  dateOfBirthChange = (event) => {
    localStorage.setItem('date_of_birth', event.target.value);
    if (event.target.value) {
      this.setState({date_of_birth: event.target.value})
    } else {
      this.setState({date_of_birth: ''})
    }
  };

  hydrateStateWithLocalStorage = () => {
    this.setState(date_of_birth => ({ phone: localStorage.getItem('date_of_birth') || '' }));
  };

  successfulDobValidation = (response) => {
    this.props.history.push("/b/"+this.props.match.params.slug+"/options");
  };

  failedDobValidation = (error) => {
    openSnackbar({ message: 'Date of birth did not match. Please try again.', variant: 'error', timeout: 3000 });
  };

  verifyDateOfBirth = () => {
    if (Validator.validDateOfBirth(this.state.date_of_birth)) {
      CheckoutService.validateDateOfBirth(this.props.match.params.slug, this.state.date_of_birth,
          this.successfulDobValidation, this.failedDobValidation)
    }
  };

  catchReturn = (event) => {
    if (event.key === 'Enter') {
      this.verifyDateOfBirth();
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <HelpBar title="Date of Birth"/>
        <ReducedContainer showLogo={false}>
          <Typography variant="body1">
            Please confirm your date of birth
            <br/>
            (we want to make sure it's really you)
          </Typography>
          <TextField
              label="Date of birth"
              margin="normal"
              variant="outlined"
              fullWidth
              onChange={this.dateOfBirthChange}
              value={this.state.date_of_birth}
              onKeyPress={this.catchReturn}
              error={!Validator.validDateOfBirth(this.state.date_of_birth)}
              autoFocus
              InputProps={{
                inputComponent: DateMaskedInput
              }}
          />
          <Button
              className={classes.button}
              fullWidth color="primary"
              variant="extendedFab"
              margin="normal"
              onClick={this.verifyDateOfBirth}
          >
            <Typography>Verify</Typography>
          </Button>
          <div className={classes.bottomNav}>
            <Typography color="secondary">we've got your payment offers ready</Typography>
          </div>
          <Notifier />
        </ReducedContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(withRouter(CheckoutDobValidationPage));