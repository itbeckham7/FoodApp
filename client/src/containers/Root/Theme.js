import { createMuiTheme } from '@material-ui/core/styles';
import {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey,
} from '@material-ui/core/colors';
import latoRegular from '../../fonts/Lato-Regular.ttf';
import latoItalic from '../../fonts/Lato-Italic.ttf';
import latoThin from '../../fonts/Lato-Thin.ttf';
import latoThinItalic from '../../fonts/Lato-ThinItalic.ttf';
import latoLight from '../../fonts/Lato-Light.ttf';
import latoLightItalic from '../../fonts/Lato-LightItalic.ttf';
import latoBold from '../../fonts/Lato-Bold.ttf';
import latoBoldItalic from '../../fonts/Lato-BoldItalic.ttf';
import latoBlack from '../../fonts/Lato-Black.ttf';
import latoBlackItalic from '../../fonts/Lato-BlackItalic.ttf';

const latoThinFont = {
  fontFamily: 'Lato',
  fontStyle: 'normal',
  fontWeight: 100,
  src: `local('Lato Thin'), local('Lato-Thin'), url(${latoThin}) format('woff2')`,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};
const latoLightFont = {
  fontFamily: 'Lato',
  fontStyle: 'normal',
  fontWeight: 300,
  src: `local('Lato Light'), local('Lato-Light'), url(${latoLight}) format('woff2')`,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};
const latoRegularFont = {
  fontFamily: 'Lato',
  fontStyle: 'normal',
  fontWeight: 'normal',
  src: `local('Lato Regular'), local('Lato-Regular'), url(${latoRegular}) format('woff2')`,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};
const latoBoldFont = {
  fontFamily: 'Lato',
  fontStyle: 'normal',
  fontWeight: 'bold',
  src: `local('Lato Bold'), local('Lato-Bold'), url(${latoBold}) format('woff2')`,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};
const latoBlackFont = {
  fontFamily: 'Lato',
  fontStyle: 'normal',
  fontWeight: 900,
  src: `local('Lato Black'), local('Lato-Black'), url(${latoBlack}) format('woff2')`,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};

const latoThinItalicFont = {
  fontFamily: 'Lato',
  fontStyle: 'italic',
  fontWeight: 100,
  src: `local('Lato ThinItalic'), local('Lato-ThinItalic'), url(${latoThinItalic}) format('woff2')`,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};
const latoLightItalicFont = {
  fontFamily: 'Lato',
  fontStyle: 'italic',
  fontWeight: 300,
  src: `local('Lato LightItalic'), local('Lato-LightItalic'), url(${latoLightItalic}) format('woff2')`,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};
const latoItalicFont = {
  fontFamily: 'Lato',
  fontStyle: 'italic',
  fontWeight: 'normal',
  src: `local('Lato Italic'), local('Lato-Italic'), url(${latoItalic}) format('woff2')`,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};
const latoBoldItalicFont = {
  fontFamily: 'Lato',
  fontStyle: 'italic',
  fontWeight: 'bold',
  src: `local('Lato BoldItalic'), local('Lato-BoldItalic'), url(${latoBoldItalic}) format('woff2')`,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};
const latoBlackItalicFont = {
  fontFamily: 'Lato',
  fontStyle: 'italic',
  fontWeight: 900,
  src: `local('Lato BlackItalic'), local('Lato-BlackItalic'), url(${latoBlackItalic}) format('woff2')`,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue['500'],
    },
    secondary: {
      main: '#E5293E',
    },
  },
  typography: {
    fontFamily: ['Lato'].join(','),
  },
  overrides: {
    body: {
      backgroundColor: '#eee'
    },
    MuiCssBaseline: {
      '@global': {
        '@font-face': [
          latoRegularFont,
          latoItalicFont,
          latoThinFont,
          latoThinItalicFont,
          latoLightFont,
          latoLightItalicFont,
          latoBoldFont,
          latoBoldItalicFont,
          latoBlackFont,
          latoBlackItalicFont
        ],
        body: {
          backgroundColor: '#f6f6f6'
        }
      },
    },
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
        position: 'absolute',
      },
    },
    MuiBottomNavigationAction: {
      root: {
        color: '#E5293E',
        '&$selected': {
          backgroundColor: '#E5293E',
          color: '#fff',
        },
      },
    },
    MuiRating: {
      root: {
        fontSize: '1.1rem',
      },
      sizeSmall: {
        fontSize: '0.8rem',
      },
    },
    MuiTab: {
      textColorPrimary: {
        '&$selected': {
          color: '#E5293E',
        },
      },
      indicator: {
        backgroundColor: '#E5293E',
      },
    },
    MuiTabPanel: {
      root: {
        padding: '0',
      },
    },
    PrivateTabIndicator: {
      colorPrimary: {
        backgroundColor: '#E5293E',
      },
    },
    MuiCheckbox: {
      colorPrimary: {
        color: '#E5293E',
        padding: '5px',
        '&$checked': {
          color: '#E5293E',
        },
      },
    },
    MuiInputBase: {
      root: {
        '&$focused': {
          borderColor: '#E5293E',
        },
      },
    },
    MuiBadge: {
      colorPrimary: {
        backgroundColor: '#ffb400',
      },
    },
    MuiButton: {
      containedPrimary: {
        backgroundColor: '#E5293E',
      },
      containedSizeLarge: {
        padding: '10px 22px',
        fontSize: '1rem',
        fontWeight: '300',
      },
      outlinedPrimary: {
        color: '#E5293E',
        borderColor: '#E5293E',
        '&:hover': {
          borderColor: '#E5293E',
        }
      },
      outlinedSizeLarge: {
        padding: '10px 22px',
        fontSize: '1rem',
        fontWeight: '300',
      },
    },
    Navigator:{
      item: {
        color: '#fff'
      }
    },
  },
});

export default theme;
