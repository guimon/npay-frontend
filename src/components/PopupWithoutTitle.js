import React from 'react';
import Markdown from 'react-markdown';
import {MuiThemeProvider, withStyles} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import NpayThemes from "../helpers/NpayThemes";

let openPopupWithoutTitleFn;

const styles = theme => ({
  paper: {
    width: '90%',
    height: '70vh',
    margin: 0
  },
  text: {
    fontSize: 16,
  }
});

class PopupWithoutTitle extends React.Component {
  state = {
    open: false,
    text: '',
  };

  componentDidMount() {
    openPopupWithoutTitleFn = this.openPopupWithoutTitle;
  }

  openPopupWithoutTitle = ({ text }) => {
    this.setState({
      open: true,
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
          <DialogContent>
            <Markdown source={this.state.text} className={classes.text}/>
          </DialogContent>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export function openPopupWithoutTitle({ text }) {
  openPopupWithoutTitleFn({ text });
}

export default withStyles(styles)(PopupWithoutTitle);
