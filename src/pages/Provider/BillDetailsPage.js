import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles/index';
import {Typography} from "@material-ui/core";

import ProviderService from "../../services/ProviderService";
import FormRow from "../../components/FormRow";
import ClearContainer from "../../components/ClearContainer";
import BillDetailsBar from "../../components/BillDetailsBar";
import ProviderBillListItem from "../../components/ProviderBillListItem";
import BillEvents from "../../components/BillEvents";
import BillPayments from "../../components/BillPayments";
import Formatter from "../../helpers/Formatter";
import Notifier, { openSnackbar } from "../../components/Notifier";
import Grid from "@material-ui/core/Grid";

const styles = () => ({
  shaded: {
    backgroundColor: '#f3f6f8',
  },
  value: {
    color: '#3D3E4D'
  },
  innerGrid: {
    alignSelf: 'flex-start',
  }
});

class BillDetailsPage extends Component {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    if (this.props.history.location.state) {
      this.setState(this.props.history.location.state);
    } else {
      this.getBill();
    }

    let intervalId = setInterval(
        () => this.getBill(),
        5000
    );

    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  successfulGetBill = (response) => {
    this.setState({ refreshing: false });
    this.setState({ bill: response.data.data });
  };

  failedGetBill = (error, authCallback) => {
    this.setState({ refreshing: false });
    authCallback(this.props.history, error);
  };

  getBill = () => {
    this.setState({ refreshing: true });
    ProviderService.getBill(this.props.match.params.slug, this.successfulGetBill, this.failedGetBill);
  };

  successfulCancelBill = (response) => {
    this.setState({ bill: response.data.data });
    openSnackbar({ message: 'Bill canceled successfully!', variant: 'success', timeout: 6000 });
  };

  failedCancelBill = (error, authCallback) => {
    authCallback(this.props.history, error);

    if (error.response.status === 400) {
      openSnackbar({ message: 'Unfortunately the bill is past the point where it can be canceled.',
        variant: 'error', timeout: 6000 });
    } else {
      openSnackbar({ message: 'Could not complete request, please try again later.',
        variant: 'error', timeout: 6000 });
    }
  };

  cancelBill = () => {
    ProviderService.cancelBill(this.props.match.params.slug, this.successfulCancelBill,
        this.failedCancelBill);
  };

  successfulResendSms = (response) => {
    this.setState({ bill: response.data.data });
    openSnackbar({ message: 'Successfully triggered the SMS Resend', variant: 'success',
      timeout: 6000 });
  };

  failedResendSms = (error, authCallback) => {
    authCallback(this.props.history, error);

    openSnackbar({ message: 'Error resending SMS. Please try again later.',
        variant: 'error', timeout: 6000 });
  };

  resendSms = () => {
    ProviderService.resendSms(this.props.match.params.slug, this.successfulResendSms,
        this.failedResendSms);
  };

  render() {
    const { classes } = this.props;
    let bill = this.state.bill;

    let customer = {};

    if (bill) {
      customer = bill.attributes.customer.attributes;
    }

    return (
        <React.Fragment>
          <BillDetailsBar title={`Bill Details`} onCancel={this.cancelBill} onResend={this.resendSms}/>
          { bill &&
             <ClearContainer>
               <div className={classes.shaded}>
                 <ProviderBillListItem bill={bill}/>
               </div>
               <FormRow label="Name">
                 <Typography className={classes.value}>
                   {customer.name}
                 </Typography>
               </FormRow>
               <FormRow label="Address">
                 <Typography className={classes.value}>
                   {customer.address}
                 </Typography>
               </FormRow>
               <FormRow label="Phone #">
                 <Typography className={classes.value}>
                   {Formatter.formatPhone(customer.phone)}
                 </Typography>
               </FormRow>
               <FormRow label="Service Date">
                 <Typography className={classes.value}>
                   {Formatter.formatDateVerbose(bill.attributes.service_date)}
                 </Typography>
               </FormRow>
               <FormRow label="Bill amount">
                 <Typography className={classes.value}>
                   {Formatter.formatMoney(bill.attributes.billed_amount)}
                 </Typography>
               </FormRow>
               <FormRow label="Bill ID">
                 <Typography className={classes.value}>
                   {bill.attributes.external_bill_id}
                 </Typography>
               </FormRow>
               <FormRow label="Link to pay bill">
                 <Typography className={classes.value} style={{ wordBreak: 'break-all' }}>
                   {bill.attributes.consumer_link}
                 </Typography>
               </FormRow>
               <Grid container className={classes.grid} direction="row" alignItems="center">
                 <Grid item xs={12} sm={6} className={classes.innerGrid}>
                   <BillEvents bill={bill} refreshing={this.state.refreshing} />
                 </Grid>
                 <Grid item xs={12} sm={6} className={classes.innerGrid}>
                   <BillPayments bill={bill} refreshing={this.state.refreshing} />
                 </Grid>
               </Grid>
               <Notifier/>
             </ClearContainer>
          }
        </React.Fragment>
    )
  }
}

export default withStyles(styles)(BillDetailsPage);