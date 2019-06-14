import React, { Component } from 'react'
import { withRouter} from "react-router-dom";

import {MuiThemeProvider, withStyles} from '@material-ui/core/styles/index';
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";

import ReducedCompactContainer from "../../components/ReducedCompactContainer";
import HelpBar from "../../components/HelpBar";
import {Elements, StripeProvider} from "react-stripe-elements";
import StripeCheckoutForm from "../../components/StripeCheckoutForm";
import {openSnackbar} from "../../components/Notifier";
import Formatter from "../../helpers/Formatter";
import ConsumerService from "../../services/ConsumerService";
import BillUtils from "../../helpers/BillUtils";
import NpayThemes from "../../helpers/NpayThemes";
import Popup, { openPopup } from '../../components/Popup';
import LegalDocumentVersions from "../../helpers/LegalDocumentVersions";

const styles = theme => ({
  amountDue: {
    padding: 10,
    paddingBottom: 0
  },
  checkbox: {
    color: '#fff',
    '&$checked': {
      color: '#455be7',
    },
  },
  checked: {},
});

class CheckoutPayInFullPage extends Component {
  state = {
    disclosureAccepted: false,
    loading: false
  };

  componentWillMount() {
    this.setState(this.props.history.location.state);
  };

  successfulAddPaymentMethod = (response) => {
    ConsumerService.sendPayment(this.state.bill.attributes.slug, BillUtils.outstandingAmount(this.state.bill),
        this.successfulBillPay, this.failedBillPay);
  };

  failedAddPaymentMethod = (error, authCallback) => {
    this.setState({loading: false});
    authCallback(this.props.history, error);

    openSnackbar({ message: 'Failed to save card information. Please try again later',
      variant: 'error', timeout: 3000 });
  };

  successfulBillPay = (response) => {
    openSnackbar({ message: 'Thanks for your payment! The bill was paid in full.',
      variant: 'success', timeout: 3000 });

    setTimeout(() => {
      this.props.history.goBack();
    }, 3000);
  };

  failedBillPay = (error, authCallback) => {
    this.setState({loading: false});
    authCallback(this.props.history, error);

    openSnackbar({ message: 'Failed to pay bill, please try again with a different card.',
      variant: 'error', timeout: 6000 });
  };

  toggleDisclosureCheckbox = () => {
    let newDisclosureAcceptance = !this.state.disclosureAccepted;
    ConsumerService.recordConsent(this.state.bill.attributes.slug,
        {terms_of_use: LegalDocumentVersions.terms_of_use_version},
        newDisclosureAcceptance);

    this.setState({ disclosureAccepted: newDisclosureAcceptance });
  };

  sendPayment = (token) => {
    this.setState({loading: true});
    ConsumerService.addPaymentMethod(token,
        this.successfulAddPaymentMethod, this.failedAddPaymentMethod);
  };

  showTerms = () => {
    fetch(LegalDocumentVersions.terms_of_use_path)
        .then((r) => r.text())
        .then(text  => {
          openPopup({ title: LegalDocumentVersions.terms_of_use_title, text: text});
        });
  };

  render() {
    const { classes, history } = this.props;
    const { bill } = this.state;
    return (
        <React.Fragment>
          <HelpBar title={"Payoff Bill"}>
            <IconButton color="inherit" aria-label="Menu" onClick={history.goBack}>
              <ArrowBackIcon />
            </IconButton>
          </HelpBar>
          <ReducedCompactContainer showLogo={false}>
            <Typography variant="subtitle1" className={classes.amountDue}>
              Amount due: {Formatter.formatMoney(BillUtils.outstandingAmount(bill))}
            </Typography>
            <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
              <Elements>
                <MuiThemeProvider theme={NpayThemes.blueButtonTheme}>
                  <StripeCheckoutForm onSubmit={this.sendPayment}
                                      submitLabel={"Confirm payment"}
                                      buttonEnabled={this.state.disclosureAccepted}
                                      loading={this.state.loading}
                                      color={"#fff"}>
                    <Grid item xs={2} style={{padding: 10}}>
                      <Checkbox
                          checked={this.state.disclosureAccepted}
                          onChange={this.toggleDisclosureCheckbox}
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
                  </StripeCheckoutForm>
                </MuiThemeProvider>
              </Elements>
            </StripeProvider>
          </ReducedCompactContainer>
          <Popup/>
        </React.Fragment>

    )
  }
}

export default withStyles(styles)(withRouter(CheckoutPayInFullPage));
