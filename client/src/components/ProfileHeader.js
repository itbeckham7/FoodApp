import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
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
    // backgroundColor: '#E5293E',
    padding: theme.spacing(1),
    color: '#333'
  },
  iconButtonAvatar: {
    padding: 4,
  },
  logoText: {
    textAlign: 'left',
    color: 'rgba(255,255,255,0.7)',
  },
});

class HistoryHeader extends React.Component {

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
                  aria-label="open drawer"
                  onClick={this.onNavigatePrev}
                  className={classes.menuButton}
                >
                  <ChevronLeft />
                </IconButton>
              </Grid>
              <Grid style={{ flex: 5 }}>
                <Typography
                  component="h4"
                  variant="h5"
                  className={classes.logoText}
                >
                  {this.props.titleElem}
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

HistoryHeader.propTypes = {
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
  connect(mapStateToProps, {}),
  withStyles(styles)
)(HistoryHeader);
