import React, { Component } from 'react'
import 'typeface-roboto';
import { BrowserRouter as Router, Route } from "react-router-dom";

import { withStyles } from "@material-ui/core";
import { MuiThemeProvider } from '@material-ui/core/styles';

import LoginPage from './pages/Provider/LoginPage'
import LogoutPage from './pages/Provider/LogoutPage'
import ForgotPage from './pages/Provider/ForgotPage'
import DashboardPage from './pages/Provider/DashboardPage'
import ResetPasswordPage from './pages/Provider/ResetPasswordPage'
import AuthyChallengePage from './pages/Provider/AuthyChallengePage'
import BillDetailsPage from './pages/Provider/BillDetailsPage'
import NewBillPage from './pages/Provider/NewBillPage'

import CheckoutDobValidationPage from './pages/Checkout/CheckoutDobValidationPage'
import CheckoutOptionsPage from './pages/Checkout/CheckoutOptionsPage'
import CheckoutPayInFullPage from './pages/Checkout/CheckoutPayInFullPage'
import CheckoutApplyNamePage from './pages/Checkout/CheckoutApplyNamePage'
import CheckoutApplyAddressPage from './pages/Checkout/CheckoutApplyAddressPage'
import CheckoutApplyIncomePage from './pages/Checkout/CheckoutApplyIncomePage'
import CheckoutUnqualifiedPage from './pages/Checkout/CheckoutUnqualifiedPage'
import CheckoutQualifiedPage from './pages/Checkout/CheckoutQualifiedPage'
import CheckoutDownPaymentPage from './pages/Checkout/CheckoutDownPaymentPage'

import ConsumerLoginPage from './pages/Consumer/ConsumerLoginPage'
import ConsumerValidateSmsPage from './pages/Consumer/ConsumerValidateSmsPage'
import ConsumerDashboardPage from './pages/Consumer/ConsumerDashboardPage'
import ConsumerLogoutPage from './pages/Consumer/ConsumerLogoutPage'
import ConsumerBillDetailsPage from './pages/Consumer/ConsumerBillDetailsPage'
import ConsumerAddPaymentMethodPage from './pages/Consumer/ConsumerAddPaymentMethodPage'
import NpayThemes from "./helpers/NpayThemes";

const styles = theme => ({
  base: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0e6b6bff',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
  }
});

class App extends Component {
  render() {
    const reload = () => window.location.reload();

    const { classes } = this.props;

    return (
        <MuiThemeProvider theme={NpayThemes.darkTheme}>
          <Router>
            <div className={classes.base} >
              <Route path="/provider" exact component={LoginPage}/>
              <Route path="/provider/logout/" exact component={LogoutPage} />
              <Route path="/provider/forgot/" exact component={ForgotPage} />
              <Route path="/provider/password/edit/" exact component={ResetPasswordPage} />
              <Route path="/provider/dashboard/" exact component={DashboardPage}/>
              <Route path="/provider/bill/:slug" component={BillDetailsPage}/>
              <Route path="/provider/new_bill/" component={NewBillPage}/>
              <Route path="/provider/authy_challenge/" exact component={AuthyChallengePage}/>

              <Route path="/b/:slug" exact component={CheckoutDobValidationPage}/>
              <Route path="/b/:slug/options" exact component={CheckoutOptionsPage}/>
              <Route path="/b/:slug/unqualified" exact component={CheckoutUnqualifiedPage}/>
              <Route path="/b/:slug/qualified" exact component={CheckoutQualifiedPage}/>
              <Route path="/b/:slug/down_payment" exact component={CheckoutDownPaymentPage}/>
              <Route path="/b/:slug/pay_in_full" exact component={CheckoutPayInFullPage}/>
              <Route path="/b/:slug/apply" exact component={CheckoutApplyNamePage}/>
              <Route path="/b/:slug/apply_address" exact component={CheckoutApplyAddressPage}/>
              <Route path="/b/:slug/apply_income" exact component={CheckoutApplyIncomePage}/>

              <Route path="/" exact component={ConsumerLoginPage}/>
              <Route path="/logout" exact component={ConsumerLogoutPage}/>
              <Route path="/consumer/validate_sms" exact component={ConsumerValidateSmsPage}/>
              <Route path="/consumer/dashboard" exact component={ConsumerDashboardPage}/>
              <Route path="/consumer/bill/:slug" component={ConsumerBillDetailsPage}/>
              <Route path="/consumer/add_payment_method" exact component={ConsumerAddPaymentMethodPage}/>

              <Route path="/.well-known/apple-developer-merchantid-domain-association" onEnter={reload} />
            </div>
          </Router>
        </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
