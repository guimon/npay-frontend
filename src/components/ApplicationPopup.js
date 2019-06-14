import React from 'react';

import {withStyles} from '@material-ui/core/styles/index';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {DialogTitle, IconButton, Typography} from "@material-ui/core";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import TripOriginOutlined from '@material-ui/icons/TripOriginOutlined';

let openApplicationPopupFn;

const styles = theme => ({
  paper: {
    width: '95%',
    [theme.breakpoints.up('sm')]: {
      width: '55%',
    },
    [theme.breakpoints.up('md')]: {
      width: '35%',
    },
    margin: 0
  },
  title: {
    textAlign: 'right',
    padding: 0
  },
  logo: {
    maxWidth: '30%',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '20%',
    },
  },
  steps: {
    padding: 0,
    paddingTop: 24
  },
  stepLabel: {
    fontWeight: '400 !important',
    fontSize: 12
  }
});

class ApplicationPopup extends React.Component {
  state = {
    open: false,
  };

  componentDidMount() {
    openApplicationPopupFn = this.openApplicationPopup;
  }

  openApplicationPopup = () => {
    this.setState({
      open: true,
    });
  };

  handlePopupClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Dialog onClose={this.handlePopupClose} open={this.state.open}
              fullWidth={true} maxWidth="lg" classes={{paper: classes.paper}}>
        <DialogTitle className={classes.title}>
          <IconButton aria-label="Close" onClick={this.handlePopupClose}>
            <CloseIcon color={"primary"} />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{textAlign: 'center'}}>
          <div>
            <img className={classes.logo} src="/application_info.png" alt={"Info"}/>
          </div>
          <Typography variant={"subtitle1"}>
            Easy, monthly payments for you, and your loved ones care
          </Typography>
          <Stepper orientation="vertical" className={classes.steps}>
            <Step completed={true}>
              <StepLabel classes={{label: classes.stepLabel}} icon={<TripOriginOutlined style={{color: '#455be7'}}/>}>
                Just a few pieces of information is all it takes to get to a real time decision.
              </StepLabel>
            </Step>
            <Step completed={true}>
              <StepLabel classes={{label: classes.stepLabel}} icon={<TripOriginOutlined style={{color: '#455be7'}}/>}>
                Your bill is split up into four payments. There's no interest - and never any hidden fees.
              </StepLabel>
            </Step>
            <Step completed={true}>
              <StepLabel classes={{label: classes.stepLabel}} icon={<TripOriginOutlined style={{color: '#455be7'}}/>}>
                Turn on automatic payments so you never have to worry about missing a payment.
              </StepLabel>
            </Step>
          </Stepper>
          <Typography variant={"caption"} style={{marginTop: 24}}>
            Subject to credit check. Down payment might be required.
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }
}

export function openApplicationPopup() {
  openApplicationPopupFn();
}

export default withStyles(styles)(ApplicationPopup);