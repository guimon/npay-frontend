import React, { Component } from 'react'
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import BillUtils from "../helpers/BillUtils";

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  error: {
    backgroundColor: '#ff0000'
  },
  inProgress: {
    backgroundColor: '#455be7'
  },
  canceled: {
    backgroundColor: '#777777'
  }
});

class ConsumerBillProgress extends Component {
  getPercentageComplete = () => {
    const { payment_status, selected_credit_offer, billed_amount } =
        this.props.bill.attributes;

    if ((payment_status === "Pending") || (!selected_credit_offer)) return 5;
    if (payment_status === "Paid") return 100;

    let paid = BillUtils.sumTotalPaidAmount(this.props.bill);

    return 10 + (paid * 90 / billed_amount);
  };

  render() {
    const { classes, bill } = this.props;
    const { payment_status } = bill.attributes;
    return (
        <div className={classes.root}>
          {["Past Due"].includes(payment_status) &&
            <LinearProgress variant="determinate" value={this.getPercentageComplete()}
                            style={{backgroundColor: '#d1d0d3'}}
                            classes={{bar: classes.error}}/>
          }
          {["Pending", "On Time"].includes(payment_status) &&
          <LinearProgress variant="determinate" value={this.getPercentageComplete()}
                          style={{backgroundColor: '#d1d0d3'}}
                          classes={{bar: classes.inProgress}}/>
          }
          {["Paid"].includes(payment_status) &&
          <LinearProgress variant="determinate" value={100}/>
          }
        </div>
    );
  }
}

ConsumerBillProgress.propTypes = {
  bill: PropTypes.object.isRequired,
};

export default withStyles(styles)(ConsumerBillProgress);