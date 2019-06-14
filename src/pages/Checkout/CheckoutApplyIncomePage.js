import React, { Component } from 'react'
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles/index';
import { withRouter} from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {Grid} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";

import RoundedContainer from "../../components/RoundedContainer";
import NpayThemes from "../../helpers/NpayThemes";
import Notifier, {openSnackbar} from "../../components/Notifier";
import ConsumerService from "../../services/ConsumerService";
import BlueButton from "../../components/BlueButton";
import MoneyMaskedInput from "../../components/MoneyMaskedInput";
import ConsumerBillRouterUtils from "../../helpers/ConsumerBillRouterUtils";
import LegalDocumentVersions from "../../helpers/LegalDocumentVersions";
import Popup, {openPopup} from "../../components/Popup";

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

class CheckoutApplyIncomePage extends Component {
  state = {
    income: '',
    last_4_ssn: '',
    disclosureAccepted: false,
    loading: false,
  };

  onIncomeChange = (event) => {
    if (event.target.value) {
      this.setState({income: event.target.value})
    } else {
      this.setState({income: ''})
    }
  };

  onLast4SsnChange = (event) => {
    if (event.target.value) {
      this.setState({last_4_ssn: event.target.value})
    } else {
      this.setState({last_4_ssn: ''})
    }
  };

  toggleDisclosureCheckbox = () => {
    let newDisclosureAcceptance = !this.state.disclosureAccepted;
    ConsumerService.recordConsent(this.props.match.params.slug,
        {terms_of_use: LegalDocumentVersions.terms_of_use_version},
        newDisclosureAcceptance);

    this.setState({ disclosureAccepted: newDisclosureAcceptance });
  };

  validInput = () => {
    return this.state.disclosureAccepted && this.state.income !== '' &&
        this.state.last_4_ssn.length === 4;
  };

  apply = () => {
   this.setState({loading: true});
   ConsumerService.submitApplication(this.props.match.params.slug, this.state.income,
       this.state.last_4_ssn, this.successfulSubmitApplication, this.failedSubmitApplication);
  };

  successfulSubmitApplication = (response) => {
    this.setState({loading: false});
    ConsumerBillRouterUtils.routeBill(response.data.data, this.props.history);
  };

  failedSubmitApplication = () => {
    this.setState({loading: false});
    openSnackbar({ message: 'Failed to submit application. Please try again later!',
      variant: 'error', timeout: 5000 });
  };

  showTerms = () => {
    fetch(LegalDocumentVersions.terms_of_use_path)
        .then((r) => r.text())
        .then(text  => {
          openPopup({ title: LegalDocumentVersions.terms_of_use_title, text: text});
        });
  };

  render() {
    const { classes } = this.props;

    return (
        <RoundedContainer>
          <div className={classes.innerPadding}>
            <Typography variant="subtitle1">Please add your household income and the last 4 digits of your SSN</Typography>
            <Typography color="secondary">
              This is the last step!
            </Typography>
            <MuiThemeProvider theme={NpayThemes.blueButtonLightTheme}>
              <TextField
                  label="Yearly household income"
                  margin="normal"
                  variant="filled"
                  fullWidth
                  autoFocus
                  onChange={this.onIncomeChange}
                  value={this.state.income}
                  className={classes.option}
                  style={{marginTop: 20}}
                  InputProps={{
                    inputComponent: MoneyMaskedInput,
                    disableUnderline: true
                  }}
              />
              <TextField
                  label="Last 4 digits of SSN"
                  margin="normal"
                  variant="filled"
                  fullWidth
                  onChange={this.onLast4SsnChange}
                  value={this.state.last_4_ssn}
                  className={classes.option}
                  InputProps={{
                    disableUnderline: true
                  }}
              />
              <Grid container>
                <Grid item xs={2}>
                  <Checkbox
                      onChange={this.toggleDisclosureCheckbox}
                      value="disclosureAccepted"
                      color="primary"
                      classes={{
                        root: classes.checkbox,
                        checked: classes.checked
                      }}
                  />
                </Grid>
                <Grid item xs={10} style={{padding: 10}}>
                  <Typography variant="caption" color={"secondary"} className={classes.disclosures}>
                    I have reviewed and electronically agree to the
                    <span style={{color: '#455be7'}} onClick={() => this.showTerms()}> Terms and conditions</span>.
                  </Typography>
                </Grid>
              </Grid>

              <BlueButton label={"Submit Application"} onClick={this.apply} enabled={this.validInput()} loading={this.state.loading}/>
            </MuiThemeProvider>
          </div>
          <Notifier/>
          <Popup/>
        </RoundedContainer>
    )
  }
}

export default withStyles(styles)(withRouter(CheckoutApplyIncomePage));
