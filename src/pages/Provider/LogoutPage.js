import React, { Component } from 'react'
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles/index';
import {Typography} from "@material-ui/core";

import ProviderAuthService from '../../services/ProviderAuthService';
import ReducedContainer from "../../components/ReducedContainer";
import Notifier, {openSnackbar} from "../../components/Notifier";

const styles = theme => ({
  button: {
    marginTop: 2 * theme.spacing.unit
  },
  bottomNav: {
    marginTop: '10vh'
  },
  bottomLink: {
    cursor: 'pointer',
    alignSelf: 'start',
    fontVariant: 'all-small-caps',
    textDecoration: 'none',
  }
});

class LogoutPage extends Component {
  componentDidMount() {
    this.logout();
  }

  successfulLogout = () => {
    this.props.history.push("/provider");
  };

  failedLogout = () => {
    openSnackbar({ message: 'Logout failed!', variant: 'error', timeout: 3000 });
  };

  logout = () => {
    ProviderAuthService.logout(this.successfulLogout, this.failedLogout);
  };

  render() {
    return (
      <ReducedContainer>
        <Typography variant="headline">Logging out...</Typography>
        <Notifier/>
      </ReducedContainer>
    )
  }
}

export default withStyles(styles)(withRouter(LogoutPage));