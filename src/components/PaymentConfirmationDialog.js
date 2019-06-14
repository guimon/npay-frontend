import React from 'react';
import PropTypes from "prop-types";

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core";

import Formatter from "../helpers/Formatter";

const styles = theme => ({
  paper: {
    width: '90%',
    margin: 0
  },
});

class PaymentConfirmationDialog extends React.Component {
  render() {
    const { classes, open, amount, onCancel, onConfirm, providerName, isFull } = this.props;

    return (
      <Dialog onClose={onCancel} open={open}
              fullWidth={true} maxWidth="lg" classes={{paper: classes.paper}}>
        <DialogTitle>Please confirm your payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isFull &&
             `Do you confirm sending a payment of ${Formatter.formatMoney(amount)} to pay off your bill with ${providerName }?` }
            {!isFull &&
            `Do you confirm sending a payment of ${Formatter.formatMoney(amount)} to ${providerName }?` }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="primary">
            Send Payment
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

PaymentConfirmationDialog.propTypes = {
  providerName: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  isFull: PropTypes.bool.isRequired,
  amount: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm:  PropTypes.func.isRequired
};

export default withStyles(styles)(PaymentConfirmationDialog);