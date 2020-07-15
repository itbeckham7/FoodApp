import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import {
  Account,
  Bell,
  Logout,
  CartPlus,
  Menu as MenuIcon,
} from 'mdi-material-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getIsSignedIn,
  getCurrentUser,
  getSignedInWith,
  getBagBags,
} from '../store/selectors';
import { signOut, getBags } from '../store/actions';

import useScrollTrigger from '@material-ui/core/useScrollTrigger';

function ShowOnScroll({ children }) {
  const trigger = useScrollTrigger({ threshold: 48, disableHysteresis: true });
  return (
    <Slide in={trigger} direction="up">
      <span>{children}</span>
    </Slide>
  );
}

const styles = (theme) => ({
  secondaryBar: {
    zIndex: 0,
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
    backgroundColor: '#E5293E',
    padding: theme.spacing(1),
  },
  iconButtonAvatar: {
    padding: 4,
  },
  logoText: {
    textAlign: 'left',
    color: 'rgba(255,255,255,0.7)',
  },
});

class Header extends React.Component {
  state = { anchorEl: null };

  constructor() {
    super();
    this.onGotoBag = this.onGotoBag.bind(this);
  }

  componentWillMount() {
    const { me } = this.props;
    this.props.getBags(me._id).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        return;
      }

      console.log('-- bags : ', this.props.bags);
    });
  }

  onMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  onGotoBag = () => {
    window.location = '/dashboard/bag';
  };

  getBrand = () => {
    const { routes: routeCategories, pathname } = this.props;

    let brand = '';
    routeCategories.forEach(({ routes }) => {
      routes.forEach(({ name, path, title }) => {
        var pathArr = path.split('/');
        var pathnameArr = pathname.split('/');

        console.log('-- pathArr : ', pathArr, pathnameArr);

        if (pathArr.length == pathnameArr.length) {
          var isSuccess = true;
          for (var i = 0; i < pathArr.length; i++) {
            if (pathArr[i] != pathnameArr[i]) {
              console.log('-- pathArr[i][0] : ', pathArr[i][0]);
              if (pathArr[i][0] == ':') continue;
              isSuccess = false;
              break;
            }
          }

          if (isSuccess) brand = title;
        }
      });
    });
    return brand;
  };

  render() {
    const {
      classes,
      onDrawerToggle,
      me,
      authProvider,
      signOut,
      bags,
    } = this.props;

    const { anchorEl } = this.state;

    return (
      <React.Fragment>
        <AppBar color="primary" position="sticky" elevation={0}>
          <Toolbar variant="dense">
            <Grid
              container
              spacing={1}
              alignItems="center"
              justify="space-between"
            >
              <Hidden lgUp>
                <Grid item style={{ flex: 1 }}>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={onDrawerToggle}
                    className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
              </Hidden>
              <Grid style={{ flex: 5 }}>
                <Typography
                  component="h4"
                  variant="h5"
                  className={classes.logoText}
                >
                  {this.getBrand()}
                </Typography>
              </Grid>
              <Grid style={{ flex: 1, textAlign: 'right' }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={this.onGotoBag}
                  className={classes.menuButton}
                >
                  <Badge badgeContent={bags.length} color="primary">
                    <div
                      style={{
                        width: '1em',
                        height: '1em',
                        backgroundImage: 'url(/images/BASKET.png)',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    ></div>
                  </Badge>
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: getIsSignedIn(state),
    me: getCurrentUser(state),
    bags: getBagBags(state),
    authProvider: getSignedInWith(state),
    pathname: state.router.location.pathname,
  };
};

export default compose(
  connect(mapStateToProps, { signOut, push, getBags }),
  withStyles(styles)
)(Header);
