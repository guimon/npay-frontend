import React, { Component } from 'react'
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles/index';
import { withRouter} from "react-router-dom";

import RoundedContainer from "../../components/RoundedContainer";
import Typography from "@material-ui/core/Typography";
import NpayThemes from "../../helpers/NpayThemes";
import Notifier from "../../components/Notifier";
import ConsumerService from "../../services/ConsumerService";
import TextField from "@material-ui/core/TextField";
import BlueButton from "../../components/BlueButton";

const styles = theme => ({
  innerPadding: {
    padding: '3vh',
    paddingBottom: 0
  },
  option: {
    padding: 0,
    marginTop: 0
  },
});

class CheckoutApplyAddressPage extends Component {
  state = {
    street_address: ConsumerService.loadCustomer().street_address,
    address_complement: ConsumerService.loadCustomer().address_complement,
    city: ConsumerService.loadCustomer().city,
    state: ConsumerService.loadCustomer().state,
    zip_code: ConsumerService.loadCustomer().zip_code,
  };

  onAddressChange = (event) => {
    const { target: { name, value } } = event;
    this.setState({ [name]: value })
  };

  updateAddress = () => {
    let customer = ConsumerService.loadCustomer();
    customer.street_address = this.state.street_address;
    customer.address_complement = this.state.address_complement;
    customer.city = this.state.city;
    customer.state = this.state.state;
    customer.zip_code = this.state.zip_code;
    ConsumerService.storeCustomer(customer);
    this.props.history.push("/b/"+this.props.match.params.slug+"/apply_income");
  };

  render() {
    const { classes } = this.props;

    return (
        <RoundedContainer>
          <div className={classes.innerPadding}>
            <Typography variant="subtitle1">Does this address look right?</Typography>
            <Typography color="secondary">
              We got this from your doctor too
            </Typography>
            <MuiThemeProvider theme={NpayThemes.blueButtonLightTheme}>
              <TextField
                  label="Street address"
                  margin="normal"
                  variant="filled"
                  fullWidth
                  name="street_address"
                  onChange={this.onAddressChange}
                  value={this.state.street_address}
                  className={classes.option}
                  style={{marginTop: 20}}
                  InputProps={{
                    disableUnderline: true
                  }}
              />
              <TextField
                  label="Address line 2"
                  margin="normal"
                  variant="filled"
                  fullWidth
                  name="address_complement"
                  onChange={this.onAddressChange}
                  value={this.state.address_complement}
                  className={classes.option}
                  InputProps={{
                    disableUnderline: true
                  }}
              />
              <TextField
                  label="City"
                  margin="normal"
                  variant="filled"
                  fullWidth
                  name="city"
                  onChange={this.onAddressChange}
                  value={this.state.city}
                  className={classes.option}
                  InputProps={{
                    disableUnderline: true
                  }}
              />
              <TextField
                  label="State"
                  margin="normal"
                  variant="filled"
                  fullWidth
                  name="state"
                  onChange={this.onAddressChange}
                  value={this.state.state}
                  className={classes.option}
                  InputProps={{
                    disableUnderline: true
                  }}
              />
              <TextField
                  label="Zip Code"
                  margin="normal"
                  variant="filled"
                  fullWidth
                  name="zip_code"
                  onChange={this.onAddressChange}
                  value={this.state.zip_code}
                  className={classes.option}
                  InputProps={{
                    disableUnderline: true
                  }}
              />

              <BlueButton label={"Yes it does"} onClick={this.updateAddress} enabled={true}/>
            </MuiThemeProvider>
          </div>
          <Notifier/>
        </RoundedContainer>
    )
  }
}

export default withStyles(styles)(withRouter(CheckoutApplyAddressPage));
