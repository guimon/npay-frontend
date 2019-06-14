import React, { Component } from 'react'
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles/index';
import { withRouter} from "react-router-dom";

import Typography from "@material-ui/core/Typography/index";
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import LocalOfferOutlined from '@material-ui/icons/LocalOfferOutlined';
import {Button, CircularProgress, Divider, Grid} from "@material-ui/core";
import ChevronRight from '@material-ui/icons/ChevronRight';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import RoundedContainer from "../../components/RoundedContainer";
import CheckoutService from "../../services/CheckoutService";
import Notifier, { openSnackbar } from "../../components/Notifier";
import Formatter from "../../helpers/Formatter";
import NpayThemes from "../../helpers/NpayThemes";
import ApplicationPopup, { openApplicationPopup } from "../../components/ApplicationPopup";
import ConsumerBillRouterUtils from "../../helpers/ConsumerBillRouterUtils";
import ConsumerService from "../../services/ConsumerService";
import PopupWithoutTitle, {openPopupWithoutTitle} from "../../components/PopupWithoutTitle";

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
  grids: {
    marginTop: 10
  },
  option: {
    padding: 10,
    paddingBottom: 5,
  },
  button: {
    width: 90,
    padding: 12,
    borderRadius: 8
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
  caption: {
    padding: 5
  },
  borderRight: {
    borderRight: '1px solid #0000001E'
  },
  promoTitle: {
    fontSize: 16
  },
  footerTextSmall: {
    fontSize: 10
  },
  infoIcon: {
    verticalAlign: 'middle',
    paddingLeft: 3
  },
  explanationBar: {
    justifyContent: 'space-between',
    display: 'flex',
    paddingLeft: '3vh',
    paddingRight: '3vh',
  },
  chevron: {
    verticalAlign: 'middle',
  }
});

class CheckoutOptionsPage extends Component {
  state = {
    bill: null,
  };

  routeBill = () => {
    ConsumerBillRouterUtils.routeBill(this.state.bill, this.props.history);
  };

  componentWillMount() {
    CheckoutService.viewed(this.props.match.params.slug);
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

  apply = () => {
    CheckoutService.selectedFinance(this.props.match.params.slug);
    this.props.history.push("/b/" + this.props.match.params.slug + "/apply", {customer: this.state.customer});
  };

  financeInfo = () => {
    openApplicationPopup();
  };

  showBillNote =() => {
    const { bill } = this.state;
    const { provider } = bill.attributes;
    let bill_note = provider.attributes.bill_note;
    bill_note = bill_note.replace(/{{customer_name}}/g, ConsumerService.loadCustomer().first_name);
    bill_note = bill_note.replace(/{{provider_name}}/g, provider.attributes.name);
    bill_note = bill_note.replace(/{{provider_phone}}/g, provider.attributes.phone);
    bill_note = bill_note.replace(/{{bill_service_date}}/g, Formatter.formatDateSimple(bill.attributes.service_date));
    bill_note = bill_note.replace(/{{bill_amount}}/g, Formatter.formatMoney(bill.attributes.billed_amount));
    openPopupWithoutTitle({text: bill_note});
  };

  render() {
    const { classes } = this.props;
    const { bill } = this.state;

    return (
        <RoundedContainer>
          { !bill && <CircularProgress className={classes.progress}/> }
          { bill && <React.Fragment>
            <div className={classes.innerPadding}>
              <Typography variant="subtitle1">{ConsumerService.loadCustomer().first_name}, you've got payment options!</Typography>
              <Typography color="secondary">
                You've received a new bill from {bill.attributes.provider.attributes.name} due to a visit on {Formatter.formatDate(bill.attributes.service_date)}.
                For payment, select one of these options:
              </Typography>
              <Grid container className={classes.grids}>
                <Grid item xs={6} className={classes.borderRight}>
                  <Typography className={classes.option}>Pay over time</Typography>
                  <MuiThemeProvider theme={NpayThemes.blueButtonTheme}>
                    <Button variant="contained" color="primary" size="large" className={classes.button} classes={{label: classes.fixButton}} onClick={this.apply}>
                      <Typography className={classes.buttonTextSmall}>From only</Typography>
                      <Typography className={classes.buttonText} variant="h6">
                        {Formatter.formatMoney(bill.attributes.billed_amount/4)}
                      </Typography>
                      <Typography className={classes.buttonTextSmall}>per month</Typography>
                    </Button>
                  </MuiThemeProvider>

                  <Typography color="secondary" variant="caption" className={classes.caption}>
                    3 Months Duration <InfoOutlined color={"secondary"} className={classes.infoIcon} onClick={this.financeInfo}/>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
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
                </Grid>
              </Grid>
            </div>
            <Divider />
            <Grid container className={classes.grids} style={{paddingBottom: 10}}>
              <Grid item xs={2}>
                <LocalOfferOutlined color={"primary"} style={{paddingTop: 5}}/>
              </Grid>
              <Grid item xs={10} style={{textAlign: 'left'}}>
                <Typography variant="h6" className={classes.promoTitle}>0% Promotional financing</Typography>
                <Typography color="secondary" className={classes.footerTextSmall}>Available for well qualified consumers</Typography>
              </Grid>
            </Grid>
            <Divider />
            <List component="nav">
              <ListItem button onClick={this.showBillNote}>
                <ListItemText primary="What's this bill for?" />
                <ChevronRight color={"primary"}/>
              </ListItem>
            </List>
          </React.Fragment>}
          <Notifier/>
          <PopupWithoutTitle/>
          <ApplicationPopup />
        </RoundedContainer>
    )
  }
}

export default withStyles(styles)(withRouter(CheckoutOptionsPage));
