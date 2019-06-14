import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import NavigationMenuHelper from "../helpers/NavigationMenuHelper";

const styles = theme => ({
  menu: {
    backgroundColor: '#211d30'
  },
  menuItem: {
    justifyContent: 'center'
  },
  menuItemText: {
    flex: 'none',
    padding: 0,
  }
});

class LinksMenu extends Component {
  getComponent = (href) => {
    if (href.startsWith("/")) {
      return RouterLink;
    } else {
      return Link;
    }
  };

  render() {
    const { classes, onClose, history, opened, links } = this.props;

    return (
      <Drawer anchor="top" open={opened} onClose={onClose} classes={{paper: classes.menu}}>
        <List component="nav">
          {links.map((link) => (
            <ListItem button className={classes.menuItem} component={ this.getComponent(link.href) } to={ link.href } href={ link.href } key={`ListItem${ link.name }`}>
              <ListItemText
                  primary={ link.name }
                  classes={{ root: classes.menuItemText }}
                  primaryTypographyProps={{
                    variant: "button",
                    color: NavigationMenuHelper.getLinkColor(link.href, history)
                  }}/>
            </ListItem>
          ))}
        </List>
      </Drawer>
    )
  }
}

LinksMenu.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired,
};

export default withStyles(styles)(withRouter(LinksMenu));