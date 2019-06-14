import React, { Component } from 'react'
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import BillPaymentRow from "./BillPaymentRow";
import BillUtils from "../helpers/BillUtils";
import Formatter from "../helpers/Formatter";

const styles = () => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f3fff3',
  },
  title: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
  },
  children: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  progress: {
    color: '#455be7',
    marginLeft: 10
  },
  totals : {
    paddingLeft: 16,
    paddingRight: 16,
  }
});

class BillPayments extends Component {
  render() {
    const { classes, bill, refreshing } = this.props;

    return (
        <div className={classes.root}>
          <Typography variant="overline" color="secondary" className={classes.title}>
            Payments
            {refreshing &&
              <CircularProgress className={classes.progress} size={12} thickness={5} />
            }
          </Typography>
          {bill.attributes.payments &&
          <div className={classes.children}>
            {bill.attributes.payments.sort((e1, e2) => e2.id - e1.id).map((payment) => (
                <BillPaymentRow payment={payment} key={payment.id}/>
            ))}
          </div>}
          <Typography variant="overline" color="secondary" className={classes.totals} style={{marginTop: 10}}>
            Total paid so far:
            <strong>{Formatter.formatMoney(BillUtils.sumTotalPaidAmount(bill))}</strong>
          </Typography>
          <Typography variant="overline" color="secondary" className={classes.totals}>
            Amount outstanding:
            <strong>{Formatter.formatMoney(BillUtils.outstandingAmount(bill))}</strong>
          </Typography>
        </div>
    )
  }
}

BillPayments.propTypes = {
  bill: PropTypes.object.isRequired,
  refreshing: PropTypes.bool.isRequired
};

export default withStyles(styles)(BillPayments);