import React, { Component } from 'react'
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles/index';
import {Typography} from "@material-ui/core";

import ConsumerService from '../../services/ConsumerService';
import ReducedContainer from "../../components/ReducedContainer";

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

class ConsumerLogoutPage extends Component {
  componentDidMount() {
    ConsumerService.deleteAuthToken();
    this.props.history.push("/");
  }

  render() {
    return (
      <ReducedContainer>
        <Typography variant="headline">Logging out...</Typography>
      </ReducedContainer>
    )
  }
}

export default withStyles(styles)(withRouter(ConsumerLogoutPage));