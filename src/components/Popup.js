import React from 'react';
import Markdown from 'react-markdown';
import {MuiThemeProvider, withStyles} from "@material-ui/core";

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import NpayThemes from "../helpers/NpayThemes";

let openPopupFn;

const styles = theme => ({
  paper: {
    width: '90%',
    height: '70vh',
    margin: 0
  },
  text: {
    fontSize: 10,
  }
});

class Popup extends React.Component {
  state = {
    open: false,
    title: '',
    text: '',
  };

  componentDidMount() {
    openPopupFn = this.openPopup;
  }

  openPopup = ({ title, text }) => {
    this.setState({
      open: true,
      title,
      text,
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
      <MuiThemeProvider theme={NpayThemes.lightTheme}>
        <Dialog onClose={this.handlePopupClose} open={this.state.open}
                fullWidth={true} maxWidth="lg" classes={{paper: classes.paper}}>
          <DialogTitle>{this.state.title}</DialogTitle>
          <DialogContent>
            <Markdown source={this.state.text} className={classes.text}/>
          </DialogContent>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export function openPopup({ title, text }) {
  openPopupFn({ title, text });
}

export default withStyles(styles)(Popup);
