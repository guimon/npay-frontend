import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
  topBar: {
    backgroundColor: '#0e6b6bff'
  },
  menu: {
    backgroundColor: '#211d30'
  },
  menuItem: {
    justifyContent: 'center'
  },
  menuItemText: {
    flex: 'none',
    padding: 0,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class BillDetailsBar extends Component {
  state = {
    openMenu: false
  };

  toggleMenu = () => {
    this.setState({ openMenu: !this.state.openMenu });
  };

  back = () => {
    this.props.history.push("/provider/dashboard");
  };

  cancelBill = () => {
    this.toggleMenu();
    this.props.onCancel();
  };

  resendSms = () => {
    this.toggleMenu();
    this.props.onResend();
  };

  render() {
    const { classes, title } = this.props;

    return (
        <React.Fragment>
          <Drawer anchor="top" open={this.state.openMenu} onClose={this.toggleMenu} classes={{paper: classes.menu}}>
            <List component="nav">
              <ListItem button className={classes.menuItem} onClick={this.cancelBill}>
                <ListItemText primary="Cancel Bill" classes={{root: classes.menuItemText}} primaryTypographyProps={{variant: "button"}}/>
              </ListItem>
              <ListItem button className={classes.menuItem} onClick={this.resendSms}>
                <ListItemText primary="Resend SMS" classes={{root: classes.menuItemText}} primaryTypographyProps={{variant: "button"}}/>
              </ListItem>
              <ListItem button className={classes.menuItem} component="a" href="/provider/new_bill">
                <ListItemText primary="New Bill" classes={{root: classes.menuItemText}} primaryTypographyProps={{variant: "button"}}/>
              </ListItem>
            </List>
          </Drawer>
          <AppBar position="sticky" color="secondary" classes={{root: classes.topBar}}>
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.back}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                {title}
              </Typography>
              <IconButton color="inherit" onClick={this.toggleMenu}>
                <MoreVertIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </React.Fragment>
    )
  }
}

BillDetailsBar.propTypes = {
  title: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onResend:  PropTypes.func.isRequired,
};

export default withStyles(styles)(withRouter(BillDetailsBar));
