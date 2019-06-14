import React, { Component } from 'react'
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import BillEventRow from "./BillEventRow";

const styles = () => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f3f6f8',
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
  }
});

class BillEvents extends Component {
  render() {
    const { classes, bill, refreshing } = this.props;

    return (
        <div className={classes.root}>
          <Typography variant="overline" color="secondary" className={classes.title}>
            Bill Events
            {refreshing &&
              <CircularProgress className={classes.progress} size={12} thickness={5} />
            }
          </Typography>
          {bill.attributes.bill_events &&
          <div className={classes.children}>
            {bill.attributes.bill_events.sort((e1, e2) => e2.id - e1.id).map((bill_event) => (
                <BillEventRow billEvent={bill_event} key={bill_event.id}/>
            ))}
          </div>}
        </div>
    )
  }
}

BillEvents.propTypes = {
  bill: PropTypes.object.isRequired,
  refreshing: PropTypes.bool.isRequired
};

export default withStyles(styles)(BillEvents);