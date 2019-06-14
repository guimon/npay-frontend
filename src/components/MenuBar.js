import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';

import LinksMenu from "./LinksMenu";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
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
  fullList: {
    width: 'auto'
  },
});

class MenuBar extends Component {
  state = {
    openMenu: false
  };

  toggleMenu = () => {
    this.setState({ openMenu: !this.state.openMenu });
  };

  getMenuLinks = () => {
    return [
      { name: "Bills", href: "/provider/dashboard" },
      { name: "New Bill", href: "/provider/new_bill" },
      { name: "Logout", href: "/provider/logout" },
    ];
  };

  render() {
    const { classes, title, children } = this.props;

    return (
        <React.Fragment>
          <LinksMenu opened={this.state.openMenu} onClose={this.toggleMenu} links={this.getMenuLinks()}/>
          <AppBar position="sticky" color="secondary" classes={{root: classes.topBar}}>
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleMenu}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                {title}
              </Typography>
            </Toolbar>
            {children}
          </AppBar>
        </React.Fragment>
    )
  }
}

MenuBar.propTypes = {
  title: PropTypes.string.isRequired
};

export default withStyles(styles)(withRouter(MenuBar));
