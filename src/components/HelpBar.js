import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

import LinksMenu from "./LinksMenu"

const styles = theme => ({
  title: {
    textAlign: 'center',
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  subtitle: {
    textAlign: 'center',
    flex: 1,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  topBar: {
    backgroundColor: '#0e6b6bff',
    alignItems: 'center',
    flexDirection: 'row'
  },
  toolbar: {
    alignItems: 'center',
    flex: 1
  },
  leftGrid: {
    textAlign: 'left',
    paddingLeft: 5
  },
  rightGrid: {
    textAlign: 'right',
    paddingRight: 5
  }
});

class HelpBar extends Component {
  state = {
    openMenu: false
  };

  toggleMenu = () => {
    this.setState({ openMenu: !this.state.openMenu });
  };

  getMenuLinks = () => {
    return [
        { name: "Call", href: "tel:454" },
        { name: "Email", href: "mailto:support@npay.care" },
    ];
  };

  render() {
    const { classes, title, subtitle, children } = this.props;

    return (
        <React.Fragment>
          <LinksMenu opened={this.state.openMenu} onClose={this.toggleMenu} links={this.getMenuLinks()}/>
          <AppBar position="sticky" color="secondary" classes={{root: classes.topBar}}>
            <Toolbar className={classes.toolbar} disableGutters={true}>
              <Grid container direction="row" alignItems="center">
                <Grid item xs={3} className={classes.leftGrid}>
                  {children}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="inherit" className={classes.title}>
                    {title}
                  </Typography>
                  {subtitle &&
                    <Typography variant="body2" color="primary" className={classes.subtitle}>
                      {subtitle}
                    </Typography>
                  }
                </Grid>
                <Grid item xs={3} className={classes.rightGrid}>
                  <Button color="inherit" onClick={this.toggleMenu}>
                    <Typography color="inherit" variant="button">
                      Help
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
        </React.Fragment>
    )
  }
}

HelpBar.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default withStyles(styles)(withRouter(HelpBar));
