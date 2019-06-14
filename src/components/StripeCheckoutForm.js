import React, {Component} from 'react';
import PropTypes from "prop-types";
import {CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe} from 'react-stripe-elements';

import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";

import Notifier, {openSnackbar} from "./Notifier";
import StripeElementWrapper from './StripeElementWrapper'
import Validator from "../helpers/Validator";
import BlueButton from "./BlueButton";

class StripeCheckoutForm extends Component {
  state = {
    zip_code: ''
  };

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  zipCodeChange = (event) => {
    if (event.target.value) {
      this.setState({zip_code: event.target.value})
    } else {
      this.setState({zip_code: ''})
    }
  };

  async submit() {
    let { token } = await this.props.stripe.createToken({address_zip: this.state.zip_code});

    if (token) {
      this.props.onSubmit(token.id);
    } else {
      openSnackbar({ message: 'Invalid card, please verify and try again', variant: 'error', timeout: 3000 });
    }
  }

  render() {
    const { color, children, buttonEnabled, submitLabel, loading } = this.props;
    return (
        <Grid container>
          <Grid item xs={12} style={{padding: 10, paddingBottom: 0}}>
            <StripeElementWrapper label="Card Number" component={CardNumberElement} color={color} />
          </Grid>
          <Grid item xs={5} style={{padding: 10, paddingTop: 2}}>
            <StripeElementWrapper label="Expiry (MM/YY)" component={CardExpiryElement} color={color} />
          </Grid>
          <Grid item xs={3} style={{padding: 10, paddingTop: 2}}>
            <StripeElementWrapper label="CVC" component={CardCVCElement} color={color} />
          </Grid>
          <Grid item xs={4} style={{padding: 10, paddingTop: 0}}>
            <TextField
              label="Zip Code"
              margin="normal"
              fullWidth
              type="number"
              onChange={this.zipCodeChange}
              value={this.state.zip_code}
              error={!Validator.validZipCode(this.state.zip_code)}
            />
          </Grid>
          {children}
          <Grid item xs={12} style={{textAlign: 'center', padding: 10}}>
            <BlueButton label={submitLabel} onClick={this.submit} enabled={buttonEnabled} loading={loading}/>
          </Grid>
          <Notifier/>
        </Grid>
    );
  }
}

StripeCheckoutForm.propTypes = {
  submitLabel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  buttonEnabled: PropTypes.bool,
  loading: PropTypes.bool,
};

StripeCheckoutForm.defaultProps = {
  buttonEnabled: true,
  loading: false
};

export default injectStripe(StripeCheckoutForm);