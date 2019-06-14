import { createMuiTheme } from '@material-ui/core/styles';

export const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#00b1aa'
    },
    secondary: {
      main: '#888690'
    }
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        position: 'initial'
      }
    }
  }
});

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#00b1aa'
    },
    secondary: {
      light: '#fff',
      main: '#888690'
    }
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        position: 'initial'
      }
    }
  }
});

export const blueButtonTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#455be7'
    },
    secondary: {
      main: '#888690'
    }
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        position: 'initial'
      }
    }
  }
});

export const blueButtonLightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#455be7'
    },
    secondary: {
      main: '#888690'
    }
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        position: 'initial'
      }
    }
  }
});

let NpayThemes = { lightTheme, darkTheme, blueButtonTheme, blueButtonLightTheme };
export default NpayThemes;

