import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Languages from './Languages';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  getRouteCategories,
  getCurrentUser,
  getSignedInWith,
} from '../store/selectors';
import { signOut } from '../store/actions';

const styles = (theme) => ({
  bottomNavSec: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50px',
    backgroundColor: '#fff',
    boxShadow: '0 0 15px 1px rgba(0,0,0,0.2)',
    zIndex: '100'
  },
  navElem: {
    textAlign: 'center',
  },
});

class BottomNavigator extends React.Component {
  render() {
    const {
      classes,
    } = this.props;
    
    return (
      <div className={classes.bottomNavSec}>
        <Grid container>
          <Grid xs={2} item className={classes.navElem}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={()=>{window.location='/dashboard/home'}}
              className={classes.menuButton}
            >
              <img src="/images/ico.png" alt=""/>
            </IconButton>
          </Grid>
          <Grid xs={2} item className={classes.navElem}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={()=>{window.location='/bag/checkout'}}
              className={classes.menuButton}
            >
              <img src="/images/shopping-bag-solid.png" alt=""/>
            </IconButton>
          </Grid>
          <Grid xs={4} item className={classes.navElem}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={()=>{}}
              className={classes.menuButton}
              style={{marginTop: '-50px'}}
            >
              <img src="/images/ico-1.png" alt=""/>
            </IconButton>
          </Grid>
          <Grid xs={2} item className={classes.navElem}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={()=>{window.location='/common/search'}}
              className={classes.menuButton}
              style={{marginLeft: '-15px'}}
            >
              <img src="/images/Menu-search.png" alt=""/>
            </IconButton>
          </Grid>
          <Grid xs={2} item className={classes.navElem}>
            <Languages/>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  pathname: state.router.location.pathname,
  routeCategories: getRouteCategories(state),
  me: getCurrentUser(state),
  authProvider: getSignedInWith(state),
});

BottomNavigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, { signOut, push }),
  withStyles(styles)
)(BottomNavigator);
