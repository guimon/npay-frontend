import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import _ from "lodash";

import { withStyles } from '@material-ui/core/styles/index';
import Typography from '@material-ui/core/Typography/index';
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import ConsumerService from "../../services/ConsumerService";
import ClearContainer from "../../components/ClearContainer";
import HelpBar from "../../components/HelpBar";
import LinksMenu from "../../components/LinksMenu";
import ConsumerBillListItem from "../../components/ConsumerBillListItem";
import {CircularProgress} from "@material-ui/core";
import ConsumerBillRouterUtils from "../../helpers/ConsumerBillRouterUtils";

const styles = theme => ({
  progress: {
    color: '#455be7',
    alignSelf: 'center',
    marginTop: 20,
  }
});

class ConsumerDashboardPage extends Component {
  state = {
    openMenu: false,
    searching: false,
    bills: {},
  };

  getMenuLinks = () => {
    return [
      { name: "Bills", href: "/consumer/dashboard" },
      { name: "Logout", href: "/logout" },
    ];
  };

  toggleMenu = () => {
    this.setState({ openMenu: !this.state.openMenu });
  };

  componentWillMount() {
    if (ConsumerService.loggedIn()) {
      this.getBills("");
    } else {
      this.props.history.push("/");
    }
  }

  updateBills = (new_bills) => {
    let grouped_bills = {};

    new_bills.forEach(function(bill) {
      if (grouped_bills[bill.attributes.payment_status] === undefined) {
        grouped_bills[bill.attributes.payment_status] = [];
      }

      grouped_bills[bill.attributes.payment_status].push(bill);
    });

    this.setState({ bills: grouped_bills});
  };

  successfulGetBills = (response) => {
    this.updateBills(response.data.data);
    this.setState({searching: false});
    this.props.history.replace("/consumer/dashboard", this.state);
  };

  failedGetBills = (error, authCallback) => {
    this.setState({searching: false});

    authCallback(this.props.history, error);
  };

  getBills = () => {
    this.setState({searching: true});

    ConsumerService.getBills(this.successfulGetBills, this.failedGetBills);
  };

  orderStatuses = (e1, e2) => {
    let order = ["Pending", "Past Due", "On Time", "Paid"]
    return order.indexOf(e1) - order.indexOf(e2);
  };

  routeBill = (bill) => {
    ConsumerBillRouterUtils.routeBill(bill, this.props.history);
  };

  render() {
    const { classes } = this.props;
    let consumer = ConsumerService.loadCustomer();

    return (
      <React.Fragment>
        <LinksMenu opened={this.state.openMenu} onClose={this.toggleMenu} links={this.getMenuLinks()}/>
        <HelpBar title={consumer.name} subtitle={`Member since ${consumer.member_since}`}>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleMenu}>
            <MenuIcon />
          </IconButton>
        </HelpBar>
        <ClearContainer>
          {_.size(this.state.bills) > 0 && <React.Fragment>
            {Object.keys(this.state.bills).sort(this.orderStatuses).map((status) => (
                <List dense={true} key={`status${status}`}>
                  <ListItem key={`li${status}`}>
                    <Typography variant="overline" color="secondary" key={status}>{status}</Typography>
                  </ListItem>
                  {this.state.bills[status].map((bill) => (
                      <ConsumerBillListItem bill={bill}
                                            key={`bill${bill.id}`}
                                            onClick={() => this.routeBill(bill)} />
                  ))}
                </List>
            ))}
          </React.Fragment>}
          {_.size(this.state.bills) === 0 && <CircularProgress className={classes.progress}/> }
        </ClearContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(withRouter(ConsumerDashboardPage));