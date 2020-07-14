import { createMuiTheme } from '@material-ui/core/styles';
import {red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey} from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue['500'],
    },
    secondary: {
      main: '#E5293E',
    },
  },
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: '#000',
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
      },
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: 'transparent',
        padding: '40px 20px 0',
        position: 'absolute'
      }
    },
    MuiBottomNavigationAction: {
      root: {
        color: '#E5293E',
        "&$selected": {
          backgroundColor: "#E5293E",
          color: '#fff'
        },
      }
    },
    MuiRating: {
      root: {
        fontSize: '1.1rem'
      },
      sizeSmall: {
        fontSize: '0.8rem'
      },
    },
    MuiTab: {
      textColorPrimary: {
        "&$selected": {
          color: '#E5293E'
        },
      },
      indicator: {
        backgroundColor: '#E5293E'
      }
    },
    MuiTabPanel: {
      root: {
        padding: '0'
      }
    },
    PrivateTabIndicator: {
      colorPrimary: {
        backgroundColor: '#E5293E'
      }
    },
    MuiCheckbox: {
      colorPrimary:{
        color: '#E5293E',
        padding: '5px',
        "&$checked": {
          color: '#E5293E'
        },
      }
    },
    MuiInputBase: {
      root: {
        "&$focused": {
          borderColor: '#E5293E'
        },
      }
    },
  },
});

export default theme;
