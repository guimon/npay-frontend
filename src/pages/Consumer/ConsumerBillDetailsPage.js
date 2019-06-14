import React, { Component } from 'react'
import SwipeableViews from 'react-swipeable-views';
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles/index';
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ClearContainer from "../../components/ClearContainer";
import ConsumerBillTabPayment from "../../components/ConsumerBillTabPayment";
import ConsumerService from "../../services/ConsumerService";
import HelpBar from "../../components/HelpBar";
import ConsumerBillTabDetails from "../../components/ConsumerBillTabDetails";


const styles = () => ({
  tab: {
    fontSize: 12
  }
});

class ConsumerBillDetailsPage extends Component {
  state = {
    refreshing: false,
    tabIndex: 0,
    refreshInterval: 60000,
  };

  componentWillMount() {
    if (this.props.history.location.state) {
      this.setState(this.props.history.location.state);
    } else {
      this.getBill();
    }

    let intervalId = setInterval(
        () => this.getBill(),
        this.state.refreshInterval
    );

    this.setState({intervalId: intervalId});
    this.setState({refreshInterval: this.state.refreshInterval * 1.1});
  }

  updateHistoryState() {
    if (this.state.bill) {
      this.props.history.replace(this.props.history.location.pathname, this.state);
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  successfulGetBill = (response) => {
    this.setState({ refreshing: false });
    this.setState({ bill: response.data.data }, this.updateHistoryState);
  };

  failedGetBill = (error, authCallback) => {
    this.setState({ refreshing: false });
    authCallback(this.props.history, error);
  };

  getBill = () => {
    this.setState({ refreshing: true });
    ConsumerService.getBill(this.props.match.params.slug, this.successfulGetBill, this.failedGetBill);
  };

  handleTabChange = (event, value) => {
    this.setState({ tabIndex: value });
  };

  handleSwipeableTabChange = index => {
    this.setState({ tabIndex: index });
  };

  render() {
    const { classes, history } = this.props;
    const { tabIndex, bill } = this.state;

    return (
        <React.Fragment>
          { bill &&
          <React.Fragment>
            <HelpBar title={"Bill"} subtitle={`#${bill.attributes.external_bill_id || bill.attributes.slug}`}>
              <IconButton color="inherit" aria-label="Menu" onClick={() => history.push("/consumer/dashboard")}>
                <ArrowBackIcon />
              </IconButton>
            </HelpBar>
            <ClearContainer>
              {(bill.attributes.payment_status === "Paid" || bill.attributes.payment_status === "Canceled") &&
              <React.Fragment>
                <ConsumerBillTabDetails bill={bill}/>
              </React.Fragment>
              }
              {bill.attributes.payment_status !== "Paid" && bill.attributes.payment_status !== "Canceled" &&
              <React.Fragment>
                <Tabs value={tabIndex} textColor="primary" indicatorColor="primary" variant="fullWidth" onChange={this.handleTabChange}>
                  <Tab label="Payment" classes={{label: classes.tab}}/>
                  <Tab label="Details" classes={{label: classes.tab}} />
                </Tabs>
                <SwipeableViews
                    resistance={true}
                    axis={'x'}
                    index={tabIndex}
                    animateHeight={true}
                    onChangeIndex={this.handleSwipeableTabChange}
                >
                  <div>
                    <ConsumerBillTabPayment bill={bill} onPayment={this.successfulGetBill}/>
                  </div>
                  <div>
                    <ConsumerBillTabDetails bill={bill}/>
                  </div>
                </SwipeableViews>
              </React.Fragment>
              }
            </ClearContainer>
          </React.Fragment>
          }
        </React.Fragment>
    )
  }
}

export default withStyles(styles)(withRouter(ConsumerBillDetailsPage));