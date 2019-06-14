import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import {Button, Divider, Typography} from "@material-ui/core";
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';

import SectionHeader from "./SectionHeader";
import ConsumerBillListItem from "./ConsumerBillListItem";
import FormRow from "./FormRow";
import FormRowFullWidth from "./FormRowFullWidth"
import PaymentConfirmationDialog from "./PaymentConfirmationDialog"
import Formatter from "../helpers/Formatter";
import BillUtils from "../helpers/BillUtils";
import ConsumerService from "../services/ConsumerService";
import {openSnackbar} from "./Notifier";


const styles = theme => ({
  shaded: {
    backgroundColor: '#f3f6f8',
  },
  value: {
    color: '#3D3E4D'
  },
  button: {
    color: "#fff"
  },
  paymentMethod: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

class ConsumerBillTabPayment extends Component {
  state = {
    loadingPayments: false,
    paymentMethods: [],
    paymentDialogShow: false,
    paymentDialogAmount: 0,
    paymentDialogFull: false
  };

  componentWillMount() {
    this.getPaymentMethods();
  }

  selectPaymentMetod = id => event => {
    ConsumerService.selectPaymentMethod(id, this.successfulGetPaymentMethods,
        this.failedSelectingPaymentMethod);
  };

  failedSelectingPaymentMethod = (error, authCallback) => {
    authCallback(this.props.history, error);
  };

  goToAddPaymentMethodPage = () => {
    this.props.history.push("/consumer/add_payment_method")
  };

  getPaymentMethods = () => {
    this.setState({ loadingPayments: true });
    ConsumerService.getPaymentMethods(this.successfulGetPaymentMethods, this.failedGetPaymentMethods);
  };

  successfulGetPaymentMethods = (data) => {
    this.setState({ loadingPayments: false });
    this.setState({ paymentMethods: data });
  };

  failedGetPaymentMethods = (error, authCallback) => {
    this.setState({ loadingPayments: false });
    authCallback(this.props.history, error);
    openSnackbar({ message: 'Failed to load payment methods, please try again later!',
      variant: 'error', timeout: 3000 });

    setTimeout(() => {
      this.props.history.push("/consumer/dashboard");
    }, 3000);
  };

  hidePaymentDialog = () => {
    this.setState({ paymentDialogShow: false })
  };

  sendPayment = () => {
    ConsumerService.sendPayment(this.props.bill.attributes.slug, this.state.paymentDialogAmount,
        this.successfulSendPayment, this.failedSendPayment);
    this.hidePaymentDialog();
  };

  successfulSendPayment = (data) => {
    this.props.onPayment(data);
    openSnackbar({ message: 'Thanks for your payment!', variant: 'success', timeout: 3000 });
  };

  failedSendPayment = (error, authCallback) => {
    authCallback(this.props.history, error);
    openSnackbar({ message: 'Unfortunately the payment failed. Please try again with a different card.', variant: 'error', timeout: 6000 });
  };

  makePayment = (amount) => {
    let { bill } = this.props;
    let isFull = (BillUtils.outstandingAmount(bill) === amount);

    this.setState({ paymentDialogAmount: amount, paymentDialogShow: true,
      paymentDialogFull: isFull })
  };

  render() {
    const { classes, bill, loadingPayments } = this.props;
    const { selected_credit_offer } = bill.attributes;
    const { paymentMethods, paymentDialogShow, paymentDialogAmount, paymentDialogFull } = this.state;

    return (
        <React.Fragment>
          <ConsumerBillListItem bill={bill}/>
          <Divider/>
          <SectionHeader label="Payment methods"/>
          { paymentMethods.length > 0 &&
          <React.Fragment>
            { paymentMethods.map((paymentMethod) => (
                <FormRowFullWidth key={`paymentMethod${paymentMethod.id}`}>
                  <div className={classes.paymentMethod}>
                    <Typography className={classes.value}>
                      {paymentMethod.attributes.brand} {paymentMethod.attributes.last_4}
                    </Typography>
                    <Typography className={classes.value}>
                      {paymentMethod.attributes.expiration}
                    </Typography>
                    <Switch
                        color="primary"
                        checked={paymentMethod.attributes.preferred}
                        onChange={this.selectPaymentMetod(paymentMethod.id)}
                    />
                  </div>
                </FormRowFullWidth>
            )) }
          </React.Fragment>
          }
          {!loadingPayments && paymentMethods.length === 0 &&
            <FormRowFullWidth>
              <Typography className={classes.value}>
                No cards on file, please add a new one
              </Typography>
            </FormRowFullWidth>
          }
          {loadingPayments &&
          <FormRowFullWidth>
            <CircularProgress size={30} thickness={5} />
          </FormRowFullWidth>
          }
          <FormRowFullWidth>
            <Button variant="contained" color="primary" className={classes.button} onClick={() => this.goToAddPaymentMethodPage()}>
              Add new card
            </Button>
          </FormRowFullWidth>
          <SectionHeader label="Balance"/>
          <FormRow label="Bill amount">
            <Typography className={classes.value}>
              {Formatter.formatMoney(bill.attributes.billed_amount)}
            </Typography>
          </FormRow>
          <FormRow label="Paid amount">
            <Typography className={classes.value}>
              {Formatter.formatMoney(BillUtils.sumTotalPaidAmount(bill))}
            </Typography>
          </FormRow>
          <FormRow label="Outstanding amount">
            <Typography className={classes.value}>
              {Formatter.formatMoney(BillUtils.outstandingAmount(bill))}
            </Typography>
          </FormRow>
          <FormRowFullWidth>
            <Button variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => this.makePayment(BillUtils.outstandingAmount(bill))}
                    disabled={paymentMethods.length === 0}>
              Pay full outstanding amount
            </Button>
          </FormRowFullWidth>
          {selected_credit_offer && <React.Fragment>
            <SectionHeader label="Next Installment"/>
            <FormRow label="Auto pay">
              <Typography className={classes.value}>
                {selected_credit_offer.attributes.auto_pay ? "Enabled" : "Disabled"}
              </Typography>
            </FormRow>
            <FormRow label="Due Date">
              <Typography className={classes.value}>
                {Formatter.formatDate(selected_credit_offer.attributes.next_due_date)}
              </Typography>
            </FormRow>
            <FormRow label="Amount">
              <Typography className={classes.value}>
                {Formatter.formatMoney(BillUtils.nextInstallmentAmount(bill))}
              </Typography>
            </FormRow>
            <FormRowFullWidth>
              <Button variant="contained"
                      color="primary"
                      className={classes.button}
                      onClick={() => this.makePayment(BillUtils.nextInstallmentAmount(bill))}
                      disabled={paymentMethods.length === 0}>
                Pay next installment now
              </Button>
            </FormRowFullWidth>
          </React.Fragment>
          }
          <PaymentConfirmationDialog
              providerName={bill.attributes.provider.attributes.name}
              open={paymentDialogShow}
              amount={paymentDialogAmount}
              isFull={paymentDialogFull}
              onCancel={this.hidePaymentDialog}
              onConfirm={this.sendPayment} />
          </React.Fragment>
    )
  }
}

ConsumerBillTabPayment.propTypes = {
  bill: PropTypes.object.isRequired,
  onPayment: PropTypes.func.isRequired,
};

export default withStyles(styles)(withRouter(ConsumerBillTabPayment));