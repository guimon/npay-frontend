import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import {Elements, StripeProvider} from 'react-stripe-elements';

import { withStyles } from '@material-ui/core/styles/index';
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import HelpBar from "../../components/HelpBar";
import StripeCheckoutForm from "../../components/StripeCheckoutForm";
import ClearContainer from "../../components/ClearContainer";
import Notifier, {openSnackbar} from "../../components/Notifier";
import ConsumerService from "../../services/ConsumerService";

const styles = () => ({

});

class ConsumerAddPaymentMethodPage extends Component {
  state = {
    loading: false,
  };

  successfulAddPaymentMethod = (response) => {
    openSnackbar({ message: 'Card information saved successfully!',
      variant: 'success', timeout: 3000 });

    setTimeout(() => {
      this.props.history.goBack();
    }, 3000);
  };

  failedAddPaymentMethod = (error, authCallback) => {
    this.setState({loading: false});
    authCallback(this.props.history, error);

    openSnackbar({ message: 'Failed to save card information. Please try again later',
      variant: 'error', timeout: 3000 });
  };

  addCard = (token) => {
    this.setState({loading: true});
    ConsumerService.addPaymentMethod(token,
        this.successfulAddPaymentMethod, this.failedAddPaymentMethod);
  };

  render() {
    const { history } = this.props;

    return (
        <React.Fragment>
          <HelpBar title={"Add new card"}>
            <IconButton  color="inherit" aria-label="Menu" onClick={history.goBack}>
              <ArrowBackIcon />
            </IconButton>
          </HelpBar>
          <ClearContainer>
            <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
              <Elements>
                <StripeCheckoutForm onSubmit={this.addCard}
                                    submitLabel={"Add"}
                                    loading={this.state.loading}
                                    color={"#000000de"}/>
              </Elements>
            </StripeProvider>
          </ClearContainer>
          <Notifier/>
        </React.Fragment>
    )
  }
}

export default withStyles(styles)(withRouter(ConsumerAddPaymentMethodPage));