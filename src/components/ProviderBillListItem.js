import React, { Component } from 'react'
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import _ from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

import ProviderBillProgress from './ProviderBillProgress';
import Formatter from "../helpers/Formatter";

const styles = () => ({
  root: {
    display: 'block'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  divider: {
    borderColor: '#f2f4f5'
  },
  billTitle: {
    color: '#000'
  },
  billDetails: {
    color: '#7b7b7b'
  }
});

class ProviderBillListItem extends Component {
  getColor = (status) => {
    if (status === "Expired" || status === "Failed to send") return "#ff0000";
    if (status === "Canceled") return "#777";

    return "#7b7b7b";
  };

  render() {
    const { classes, bill, onClick } = this.props;
    const { attributes } = bill;
    const { customer } = attributes;

    return (
      <ListItem button={!_.isEmpty(onClick)} onClick={onClick} divider={true} classes={{divider: classes.divider, root: classes.root}} key={`li${bill.id}`}>
        <div className={classes.row} key={`row1${bill.id}`}>
          <Typography variant="subtitle1" className={classes.billTitle} key={`name${bill.id}`}>{customer.attributes.name}</Typography>
          <Typography variant="subtitle1" className={classes.billTitle} key={`amount${bill.id}`}>{Formatter.formatMoney(bill.attributes.billed_amount)}</Typography>
        </div>
        <div className={classes.row} key={`row2${bill.id}`}>
          <Typography variant="caption" className={classes.billDetails} key={`time${bill.id}`}>
            {Formatter.formatTime(bill.attributes.created_at)} | {customer.attributes.phone}
          </Typography>
          <Typography variant="button" key={`status${bill.id}`}  style={{fontSize: '70%', color: this.getColor(bill.attributes.status)}}>
            {bill.attributes.status}
          </Typography>
        </div>
        <div className={classes.row} key={`row3${bill.id}`}>
          <ProviderBillProgress status={bill.attributes.status}/>
        </div>
      </ListItem>
    )
  }
}

ProviderBillListItem.propTypes = {
  onClick: PropTypes.func,
};

export default withStyles(styles)(withRouter(ProviderBillListItem));