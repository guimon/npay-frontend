import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

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

class ProviderBillProgress extends Component {
  getPercentageComplete = (status) => {
    if (status === "Sending") return 5;
    if (status === "Failed to send") return 10;
    if (status === "Sent") return 15;
    if (status === "Delivered") return 20;
    if (status === "Clicked") return 25;
    if (status === "Viewed") return 30;
    if (status === "Selected full") return 40;
    if (status === "Selected finance") return 40;
    if (status === "Applied") return 50;
    if (status === "Financed") return 90;
    if (status === "Settled") return 100;
    if (status === "Expired") return 100;
    if (status === "Paid in full") return 100;
    if (status === "Canceled") return 100;

    return 5
  };

  render() {
    const { classes, status } = this.props;
    return (
        <div className={classes.root}>
          {["Expired", "Failed to send"].includes(status) &&
            <LinearProgress variant="determinate" value={this.getPercentageComplete(status)}
                            style={{backgroundColor: '#d1d0d3'}}
                            classes={{bar: classes.error}}/>
          }
          {["Sending", "Sent", "Delivered", "Clicked", "Viewed", "Selected full", "Selected finance", "Applied"].includes(status) &&
          <LinearProgress variant="determinate" value={this.getPercentageComplete(status)}
                          style={{backgroundColor: '#d1d0d3'}}
                          classes={{bar: classes.inProgress}}/>
          }
          {["Financed", "Paid in full", "Settled"].includes(status) &&
          <LinearProgress variant="determinate" value={this.getPercentageComplete(status)}/>
          }
          {["Canceled"].includes(status) &&
          <LinearProgress variant="determinate" value={this.getPercentageComplete(status)}
                          style={{backgroundColor: '#d36009'}}
                          classes={{bar: classes.canceled}}/>
          }
        </div>
    );
  }
};

export default withStyles(styles)(ProviderBillProgress);