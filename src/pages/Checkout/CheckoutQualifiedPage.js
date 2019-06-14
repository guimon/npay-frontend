import React, { Component } from 'react'
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles/index';
import { withRouter} from "react-router-dom";

import Typography from "@material-ui/core/Typography/index";
import {Button, CircularProgress, Divider} from "@material-ui/core";
import CalendarTodayIcon from '@material-ui/icons/CalendarTodayOutlined';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import TripOriginOutlined from '@material-ui/icons/TripOriginOutlined';

import RoundedContainer from "../../components/RoundedContainer";
import CheckoutService from "../../services/CheckoutService";
import Notifier, { openSnackbar } from "../../components/Notifier";
import Formatter from "../../helpers/Formatter";
import NpayThemes from "../../helpers/NpayThemes";
import ConsumerBillRouterUtils from "../../helpers/ConsumerBillRouterUtils";
import BillUtils from "../../helpers/BillUtils";
import Switch from "@material-ui/core/Switch";
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
  title: {
    marginBottom: 10
  },
  icon: {
    verticalAlign: 'bottom',
    marginRight: 5,
  },
  horizontalStretch: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  steps: {
    padding: 0,
    paddingTop: 16
  },
  button: {
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  autopayContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autopay: {
    color: '#000000de',
    display: 'inline',
  },
});

class CheckoutQualifiedPage extends Component {
  state = {
    bill: null,
    autoPay: true
  };

  toggleAutoPay = () => {
    this.setState({ autoPay: !this.state.autoPay });
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

  acceptTerms = () => {
    CheckoutService.acceptTerms(this.props.match.params.slug, this.state.autoPay);
    this.routeBill();
  };

  render() {
    const { classes } = this.props;
    const { bill } = this.state;

    return (
        <RoundedContainer>
          { !bill  && <CircularProgress className={classes.progress}/> }
          { bill && <React.Fragment>
            <div className={classes.innerPadding}>
              <Typography variant="subtitle1" className={classes.title}>
                Congrats {ConsumerService.loadCustomer().first_name}, you qualified for a great rate, <b>0% for 3 months!</b>
              </Typography>
              <Typography className={classes.horizontalStretch}>
                <b><CalendarTodayIcon className={classes.icon}/> Total of payments</b> <b>{Formatter.formatMoney(bill.attributes.billed_amount)}</b>
              </Typography>
              <Stepper orientation="vertical" className={classes.steps}>
                <Step completed={true}>
                  <StepLabel classes={{label: classes.horizontalStretch}} icon={<TripOriginOutlined style={{color: '#455be7'}}/>}>
                    Due {BillUtils.dueDates(bill)[0]} <b>{Formatter.formatMoney(BillUtils.installmentAmount(bill))}</b>
                  </StepLabel>
                </Step>
                <Step completed={true}>
                  <StepLabel classes={{label: classes.horizontalStretch}} icon={<TripOriginOutlined style={{color: '#455be7'}}/>}>
                    Due {BillUtils.dueDates(bill)[1]} <b>{Formatter.formatMoney(BillUtils.installmentAmount(bill))}</b>
                  </StepLabel>
                </Step>
                <Step completed={true}>
                  <StepLabel classes={{label: classes.horizontalStretch}} icon={<TripOriginOutlined style={{color: '#455be7'}}/>}>
                    Due {BillUtils.dueDates(bill)[2]} <b>{Formatter.formatMoney(BillUtils.installmentAmount(bill))}</b>
                  </StepLabel>
                </Step>
                <Step completed={true}>
                  <StepLabel classes={{label: classes.horizontalStretch}} icon={<TripOriginOutlined style={{color: '#455be7'}}/>}>
                    Due {BillUtils.dueDates(bill)[3]} <b>{Formatter.formatMoney(BillUtils.lastInstallmentAmount(bill))}</b>
                  </StepLabel>
                </Step>
              </Stepper>
              <MuiThemeProvider theme={NpayThemes.blueButtonTheme}>
                <div className={classes.autopayContainer}>
                  <Typography className={classes.autopay}>AutoPay</Typography>
                  <Switch
                      color="primary"
                      checked={this.state.autoPay}
                      onChange={this.toggleAutoPay}
                  />
                </div>
                <Divider className={classes.divider}/>
                <Typography variant={"caption"} color={"secondary"} style={{padding: 10}}>
                  You'll never pay interest
                  <br/>
                  Dates are close estimates
                </Typography>
                <Button variant="contained" color="primary" size="large" className={classes.button} onClick={this.acceptTerms}>
                  <Typography className={classes.buttonText} variant="h6">
                    Looks good
                  </Typography>
                </Button>
              </MuiThemeProvider>
            </div>
          </React.Fragment>}
          <Notifier/>
        </RoundedContainer>
    )
  }
}

export default withStyles(styles)(withRouter(CheckoutQualifiedPage));
