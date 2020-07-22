import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {
  ChevronLeft,
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
import { getBags } from '../store/actions';

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

class HistoryBagHeader extends React.Component {

  constructor() {
    super();
  }

  componentWillMount() {
    const { me } = this.props;
    
    var that = this;
    setTimeout(function(){
      if( that.props.bags ) return;
      that.props.getBags(me.id).then(() => {
        if (that.props.errorMessage) {
          console.log('-- error : ', that.props.errorMessage);
          return;
        }
      });
    }, 2000)
  }

  onNavigatePrev = () => {
    window.history.back();
  };

  render() {
    const {
      classes,
      onDrawerToggle,
      bags,
    } = this.props;

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
              <Grid style={{ flex: 1}}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={this.onNavigatePrev}
                  className={classes.menuButton}
                >
                  <ChevronLeft />
                </IconButton>
              </Grid>
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
                  {this.props.titleElem}
                </Typography>
              </Grid>
              <Grid style={{ flex: 1, textAlign: 'right' }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={this.onGotoBag}
                  className={classes.menuButton}
                >
                  <Badge badgeContent={bags ? bags.length : 0} color="primary">
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

HistoryBagHeader.propTypes = {
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
  connect(mapStateToProps, { getBags }),
  withStyles(styles)
)(HistoryBagHeader);
