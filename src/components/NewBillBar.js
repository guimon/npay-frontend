import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
  topBar: {
    backgroundColor: '#0e6b6bff'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class NewBillBar extends Component {
  back = () => {
    this.props.history.push("/provider/dashboard");
  };

  render() {
    const { classes, title, reset } = this.props;

    return (
        <React.Fragment>
          <AppBar position="sticky" color="secondary" classes={{root: classes.topBar}}>
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.back}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                {title}
              </Typography>
              <Button color="inherit" onClick={reset}>Reset</Button>
            </Toolbar>
          </AppBar>
        </React.Fragment>
    )
  }
}

NewBillBar.propTypes = {
  title: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired,
};

export default withStyles(styles)(withRouter(NewBillBar));
