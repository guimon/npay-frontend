import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = () => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1f1e2c',
    width: '100%'
  },
  paper: {
    margin: '0px 16px 8px 16px',
    borderRadius: 20,
    backgroundColor: '#363143',
    display: 'flex',
    flexGrow: 1
  },
  inputWrapper: {
    marginLeft: 0,
    flexGrow: 1
  },
  input: {
    textIndent: 20,
    color: '#fff',
  },
  iconButton: {
    padding: 10,
  },
  progress: {
    color: '#fff',
  }
});

class SearchBar extends Component {
  render() {
    const { classes, onChange, busy, searchTerm } = this.props;

    return (
        <div className={classes.root}>
          <Paper className={classes.paper} elevation={1}>
            <InputBase
                classes={{root: classes.inputWrapper, input: classes.input}}
                onChange={onChange}
                value={searchTerm}
                placeholder="Search by name, phone, or id"/>
            <IconButton className={classes.iconButton} aria-label="Search">
              {!busy &&  <SearchIcon />}
              {busy &&  <CircularProgress className={classes.progress} size={24} thickness={5} />}
            </IconButton>
          </Paper>
        </div>
    )
  }
}

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  busy: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string
};

SearchBar.defaultProps = {
  searchTerm: ""
};

export default withStyles(styles)(SearchBar);