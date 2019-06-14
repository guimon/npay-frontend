import React, { Component } from 'react'
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import _ from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

import ConsumerBillProgress from './ConsumerBillProgress';
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
    color: '#7b7b7b',
    textTransform: 'uppercase'
  }
});

class ConsumerBillListItem extends Component {
  getColor = (status) => {
    if (status === "Past Due") return "#ff0000";
    return "#7b7b7b";
  };

  render() {
    const { classes, bill, onClick } = this.props;
    const { payment_status, billed_amount, service_date, selected_credit_offer,
      payments, provider } = bill.attributes;

    return (
      <ListItem button={!_.isEmpty(onClick)} onClick={onClick} divider={true} classes={{divider: classes.divider, root: classes.root}} key={`li${bill.id}`}>
        <div className={classes.row} key={`row1${bill.id}`}>
          <Typography variant="subtitle1" className={classes.billTitle} key={`name${bill.id}`}>{provider.attributes.name}</Typography>
          <Typography variant="subtitle1" className={classes.billTitle} key={`amount${bill.id}`}>{Formatter.formatMoney(billed_amount)}</Typography>
        </div>
        <div className={classes.row} key={`row2${bill.id}`}>
          <Typography variant="caption" className={classes.billDetails} key={`time${bill.id}`}>
            {Formatter.formatDateSimple(service_date)}
            { payment_status !== "Paid" && selected_credit_offer &&
              <React.Fragment>
                &nbsp; | {selected_credit_offer.attributes.term + 1 - payments.length} Payments remaining
              </React.Fragment>
            }
            { payment_status !== "Paid" && !selected_credit_offer &&
              <React.Fragment>
                &nbsp; | Pending
              </React.Fragment>
            }
          </Typography>
          <Typography variant="button" key={`status${bill.id}`}  style={{fontSize: '70%', color: this.getColor(payment_status)}}>
            {payment_status}
          </Typography>
        </div>
        <div className={classes.row} key={`row3${bill.id}`}>
          <ConsumerBillProgress bill={bill}/>
        </div>
      </ListItem>
    )
  }
}

ConsumerBillListItem.propTypes = {
  onClick: PropTypes.func,
};

export default withStyles(styles)(withRouter(ConsumerBillListItem));