import React, { Component } from 'react'
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles/index';
import { withRouter} from "react-router-dom";

import Typography from "@material-ui/core/Typography/index";
import {Button, CircularProgress} from "@material-ui/core";

import RoundedContainer from "../../components/RoundedContainer";
import CheckoutService from "../../services/CheckoutService";
import Notifier, { openSnackbar } from "../../components/Notifier";
import Formatter from "../../helpers/Formatter";
import NpayThemes from "../../helpers/NpayThemes";
import ConsumerBillRouterUtils from "../../helpers/ConsumerBillRouterUtils";
import ConsumerService from "../../services/ConsumerService";

const styles = theme => ({
  innerPadding: {
    padding: '3vh',
    paddingBottom: 0
  },
  progress: {
    color: '#455be7',
    alignSelf: 'center',
    marginTop: 20,
  },
  option: {
    padding: 10,
    paddingBottom: 5,
    marginTop: 10
  },
  button: {
    width: 90,
    padding: 12,
    borderRadius: 8,
    margin: 10,
    marginTop: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  buttonTextSmall: {
    color: '#fff',
    fontSize: 10
  },
  fixButton: {
    display: 'block'
  },
});

class CheckoutUnqualifiedPage extends Component {
  state = {
    bill: null,
  };

  routeBill = () => {
    ConsumerBillRouterUtils.routeBill(this.state.bill, this.props.history);
  };

  componentWillMount() {
    CheckoutService.getOptions(this.props.match.params.slug, this.successfulGetOptions,
        this.failedGetOptions);
  }

  successfulGetOptions = (response) => {
    this.setState({ bill: response.data.data }, this.routeBill);
  };

  failedGetOptions = (error, authCallback) => {
    authCallback(this.props.history, error);
    openSnackbar({ message: 'Failure! Please try again later.', variant: 'error', timeout: 3000 });
  };

  payInFull = () => {
    CheckoutService.selectedPayInFull(this.props.match.params.slug);
    this.props.history.push("/b/" + this.props.match.params.slug + "/pay_in_full", this.state);
  };

  render() {
    const { classes } = this.props;
    const { bill } = this.state;

    return (
        <RoundedContainer>
          { !bill && <CircularProgress className={classes.progress}/> }
          { bill && <React.Fragment>
            <div className={classes.innerPadding}>
              <Typography variant="subtitle1">Sorry {ConsumerService.loadCustomer().first_name}, it's us not you!</Typography>
              <Typography color="secondary">
                We weren't able to approve your application right now. However, you can pay in full here:
              </Typography>
              <Typography className={classes.option}>Pay in full today</Typography>
              <MuiThemeProvider theme={NpayThemes.blueButtonTheme}>
                <Button variant="contained" color="primary" size="large" className={classes.button} classes={{label: classes.fixButton}} onClick={this.payInFull}>
                  <Typography className={classes.buttonTextSmall}>&nbsp;</Typography>
                  <Typography className={classes.buttonText} variant="h6">
                    {Formatter.formatMoney(bill.attributes.billed_amount)}
                  </Typography>
                  <Typography className={classes.buttonTextSmall}>&nbsp;</Typography>
                </Button>
              </MuiThemeProvider>
            </div>
          </React.Fragment>}
          <Notifier/>
        </RoundedContainer>
    )
  }
}

export default withStyles(styles)(withRouter(CheckoutUnqualifiedPage));
