import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import {
  ChevronLeft,
} from 'mdi-material-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getIsSignedIn,
  getCurrentUser,
  getSignedInWith,
  getBagBags,
} from '../store/selectors';
import { signOut } from '../store/actions';

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

class CheckoutHeader extends React.Component {
  state = { anchorEl: null };

  onNavigatePrev = () => {
    window.history.back();
  };

  render() {
    const {
      classes,
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
            </Grid>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

CheckoutHeader.propTypes = {
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
  connect(mapStateToProps, { signOut, push }),
  withStyles(styles)
)(CheckoutHeader);
