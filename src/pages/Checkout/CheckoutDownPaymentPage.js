import React, { Component } from 'react'
import { withRouter} from "react-router-dom";

import {MuiThemeProvider, withStyles} from '@material-ui/core/styles/index';
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {CircularProgress, Typography} from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import Grid from "@material-ui/core/Grid";

import ReducedCompactContainer from "../../components/ReducedCompactContainer";
import HelpBar from "../../components/HelpBar";
import {Elements, StripeProvider} from "react-stripe-elements";
import StripeCheckoutForm from "../../components/StripeCheckoutForm";
import {openSnackbar} from "../../components/Notifier";
import Formatter from "../../helpers/Formatter";
import ConsumerService from "../../services/ConsumerService";
import BillUtils from "../../helpers/BillUtils";
import NpayThemes from "../../helpers/NpayThemes";
import CheckoutService from "../../services/CheckoutService";
import ConsumerBillRouterUtils from "../../helpers/ConsumerBillRouterUtils";
import LegalDocumentVersions from "../../helpers/LegalDocumentVersions";
import Popup, {openPopup} from "../../components/Popup";

const styles = theme => ({
  amountDue: {
    padding: 10,
    paddingBottom: 0
  },
  disclosures: {
    fontSize: 10,
    display: 'inline',
  },
  checkbox: {
    color: '#fff',
    '&$checked': {
      color: '#455be7',
    },
  },
  checked: {},
});

class CheckoutDownPaymentPage extends Component {
  state = {
    disclosureAccepted: false,
    loading: false
  };

  clearAccepted = () => {
    CheckoutService.clearTermsAcceptance(this.props.match.params.slug);
    this.routeBill();
  };

  componentWillMount() {
    CheckoutService.getOptions(this.props.match.params.slug, this.successfulGetOptions,
        this.failedGetOptions);
  };

  successfulGetOptions = (response) => {
    console.log(response.data.data);
    this.setState({ bill: response.data.data }, this.routeBill);
  };

  routeBill = () => {
    ConsumerBillRouterUtils.routeBill(this.state.bill, this.props.history);
  };

  failedGetOptions = (error, authCallback) => {
    authCallback(this.props.history, error);
    openSnackbar({ message: 'Failure! Please try again later.', variant: 'error', timeout: 3000 });
  };

  successfulAddPaymentMethod = (response) => {
    ConsumerService.takeOffer(this.state.bill.attributes.slug, BillUtils.installmentAmount(this.state.bill),
        CheckoutService.autoPayEnabled(this.props.match.params.slug),
        this.successfulTakeOffer, this.failedTakeOffer);
  };

  failedAddPaymentMethod = (error, authCallback) => {
    authCallback(this.props.history, error);

    openSnackbar({ message: 'Failed to save card information. Please try again later',
      variant: 'error', timeout: 3000 });
  };

  successfulTakeOffer = (response) => {
    this.setState({ bill: response.data.data });
    openSnackbar({ message: 'Thanks for your payment! Your first installment is paid off and you are good to go. Your next installment is due on ' + BillUtils.dueDates(this.state.bill)[1] +'.',
      variant: 'success', timeout: 6000 });

    setTimeout(() => {
      this.routeBill();
    }, 6000);
  };

  failedTakeOffer = (error, authCallback) => {
    this.setState({loading: false});
    authCallback(this.props.history, error);

    openSnackbar({ message: 'Payment failed, please try again with a different card.',
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

  showTila = () => {
    openPopup({ title: "Truth in Lending Disclosure", text: this.state.bill.attributes.credit_applications[0].attributes.documents[0].attributes.final_text });
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
    const { bill } = this.state;
    return (
        <React.Fragment>
          { !bill && <CircularProgress className={classes.progress}/> }
          { bill && <React.Fragment>
            <HelpBar title={"Complete the Payment"}>
              <IconButton color="inherit" aria-label="Menu" onClick={this.clearAccepted}>
                <ArrowBackIcon/>
              </IconButton>
            </HelpBar>
            <ReducedCompactContainer showLogo={false}>
              <Typography variant="subtitle1" className={classes.amountDue}>
                Amount due today: {Formatter.formatMoney(BillUtils.installmentAmount(bill))}
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
                          <span style={{color: '#455be7'}} onClick={() => this.showTila()}> Truth in Lending Disclosure and Promissory Note Agreement</span>
                          , the
                          <span style={{color: '#455be7'}} onClick={() => this.showTerms()}> Card Authorization </span>
                          and have received the
                          <span style={{color: '#455be7'}} onClick={() => this.showTila()}> Credit Score Disclosure</span>
                          . I understand that obtaining this loan may affect my credit.
                        </Typography>
                      </Grid>
                    </StripeCheckoutForm>
                  </MuiThemeProvider>
                </Elements>
              </StripeProvider>
            </ReducedCompactContainer>
          </React.Fragment>
          }
          <Popup/>
        </React.Fragment>
    )
  }
}

export default withStyles(styles)(withRouter(CheckoutDownPaymentPage));
