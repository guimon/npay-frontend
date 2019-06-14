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

class CheckoutApplyNamePage extends Component {
  state = {
    first_name: ConsumerService.loadCustomer().first_name,
    last_name: ConsumerService.loadCustomer().last_name
  };

  onFirstNameChange = (event) => {
    if (event.target.value) {
      this.setState({first_name: event.target.value})
    } else {
      this.setState({first_name: ''})
    }
  };

  onLastNameChange = (event) => {
    if (event.target.value) {
      this.setState({last_name: event.target.value})
    } else {
      this.setState({last_name: ''})
    }
  };

  updateName = () => {
    let customer = ConsumerService.loadCustomer();
    customer.first_name = this.state.first_name;
    customer.last_name = this.state.last_name;

    ConsumerService.storeCustomer(customer);

    this.props.history.push("/b/"+this.props.match.params.slug+"/apply_address");
  };

  render() {
    const { classes } = this.props;

    return (
        <RoundedContainer>
          <div className={classes.innerPadding}>
            <Typography variant="subtitle1">Ok! lets confirm a few details starting with your name</Typography>
            <Typography color="secondary">
              We got this from your doctor
            </Typography>
            <MuiThemeProvider theme={NpayThemes.blueButtonLightTheme}>
              <TextField
                  label="Your legal first name"
                  margin="normal"
                  variant="filled"
                  fullWidth
                  onChange={this.onFirstNameChange}
                  value={this.state.first_name}
                  className={classes.option}
                  style={{marginTop: 20}}
                  InputProps={{
                    disableUnderline: true
                  }}
              />
              <TextField
                  label="Your legal last name"
                  margin="normal"
                  variant="filled"
                  fullWidth
                  onChange={this.onLastNameChange}
                  value={this.state.last_name}
                  className={classes.option}
                  InputProps={{
                    disableUnderline: true
                  }}
              />
              <BlueButton label={"That's me"} onClick={this.updateName} enabled={true}/>
            </MuiThemeProvider>
          </div>
          <Notifier/>
        </RoundedContainer>
    )
  }
}

export default withStyles(styles)(withRouter(CheckoutApplyNamePage));
