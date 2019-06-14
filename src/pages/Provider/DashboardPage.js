import React, { Component } from 'react'
import _ from 'lodash';
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles/index';
import Typography from '@material-ui/core/Typography/index';
import List from '@material-ui/core/List/index';
import ListItem from '@material-ui/core/ListItem/index';

import ProviderService from '../../services/ProviderService';
import MenuBar from "../../components/MenuBar";
import ClearContainer from "../../components/ClearContainer";
import ProviderBillListItem from "../../components/ProviderBillListItem";
import SearchBar from "../../components/SearchBar";
import Formatter from "../../helpers/Formatter";

const styles = theme => ({
  button: {
    marginTop: 2 * theme.spacing.unit
  },
});

class DashboardPage extends Component {
  state = {
    searchTerm: "",
    searching: false,
    bills: {}
  };

  componentWillMount() {
    this.getBills(this.state.searchTerm);
  }

  searchBarChanged = (event) => {
    this.getBills(event.target.value);
  };

  updateBills = (new_bills) => {
    let grouped_bills = {};

    new_bills.forEach(function(bill) {
      let formattedDate = Formatter.formatDateVerbose(bill.attributes.created_at);
      if (grouped_bills[formattedDate] === undefined) {
        grouped_bills[formattedDate] = [];
      }

      grouped_bills[formattedDate].push(bill);
    });

    this.setState({ bills: grouped_bills});
  };

  successfulGetBills = (response) => {
    this.updateBills(response.data.data);
    this.setState({searching: false});
    this.props.history.replace("/provider/dashboard", this.state);
  };

  failedGetBills = (error, authCallback) => {
    this.setState({searching: false});

    authCallback(this.props.history, error);
  };

  getBills = (searchTerm) => {
    if (this.state.searchTerm === searchTerm && searchTerm !== "") return;
    this.setState({searchTerm: searchTerm});
    this.setState({searching: true});

    ProviderService.getBills(searchTerm, this.successfulGetBills, this.failedGetBills);
  };

  showBill = (bill) => {
    this.props.history.push("/provider/bill/"+bill.attributes.slug, {bill: bill});
  };

  render() {
    return (
        <React.Fragment>
          <MenuBar title="Bills">
            <SearchBar onChange={this.searchBarChanged}
                       busy={this.state.searching}
                       searchTerm={this.state.searchTerm}/>
          </MenuBar>
          <ClearContainer>
            {_.size(this.state.bills) > 0 && <React.Fragment>
                {Object.keys(this.state.bills).map((day) => (
                  <List dense={true} key={`day${day}`}>
                    <ListItem key={`li${day}`}>
                      <Typography variant="overline" color="secondary" key={day}>{day}</Typography>
                    </ListItem>
                    {this.state.bills[day].map((bill) => (
                        <ProviderBillListItem bill={bill}
                                              key={`bill${bill.id}`}
                                              onClick={() => this.showBill(bill)} />
                    ))}
                  </List>
                ))}
            </React.Fragment>}
          </ClearContainer>
        </React.Fragment>
    )
  }
}

export default withStyles(styles)(withRouter(DashboardPage));