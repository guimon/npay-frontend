import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';

import StyledSnackbarContent from "./StyledSnackbarContent";

let openSnackbarFn;

class Notifier extends React.Component {
  state = {
    open: false,
    message: '',
    variant: 'info',
    timeout: 3000
  };

  componentDidMount() {
    openSnackbarFn = this.openSnackbar;
  }

  openSnackbar = ({ message, variant, timeout }) => {
    this.setState({
      open: true,
      message,
      variant,
      timeout,
    });
  };

  handleSnackbarClose = () => {
    this.setState({
      open: false,
      message: '',
      timeout: 3000
    });
  };

  render() {
    return (
        <Snackbar
            open={this.state.open}
            autoHideDuration={this.state.timeout}
            onClose={this.handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <StyledSnackbarContent
              onClose={this.handleSnackbarClose}
              variant={this.state.variant}
              message={this.state.message}
          />
        </Snackbar>
    );
  }
}

export function openSnackbar({ message, variant, timeout }) {
  openSnackbarFn({ message, variant, timeout });
}

export default Notifier;