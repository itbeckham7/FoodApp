import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Switch, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Navigator from '../components/Navigator';
import Header from '../components/Header';
import BottomNavigator from '../components/BottomNavigator';
import ProtectedRoute from '../components/accessControl/ProtectedRoute';
import { getRouteCategories } from '../store/selectors';
import {
  Home,
  CartPlus,
  Menu,
  SearchWeb
} from 'mdi-material-ui';

const drawerWidth = 256;

const styles = (theme) => ({
  root: {
    height: '100%',
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  app: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    height: 'calc( 100% - 56px )',
  },
  bottomNav: {

  }
});

class Dashboard extends React.Component {
  state = { mobileOpen: false };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  renderSwitchRoutes = (routeCategories) => (
    <Switch>
      {routeCategories.map(({ routes }) =>
        routes.map(({ path, permissions, requiresAny, component }) => (
          <ProtectedRoute
            path={path}
            permissions={permissions}
            requiresAny={requiresAny}
            component={component}
          />
        ))
      )}
      <Route path="/">
        <Redirect to="/dashboard/home" />
      </Route>
    </Switch>
  );

  render() {
    const { classes, routeCategories } = this.props;
    const { mobileOpen } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <nav className={classes.drawer}>
          <Hidden lgUp implementation="js">
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={this.handleDrawerToggle}
            />
          </Hidden>
          <Hidden mdDown implementation="css">
            <Navigator PaperProps={{ style: { width: drawerWidth } }} />
          </Hidden>
        </nav>
        <div className={classes.app}>
          <Header
            onDrawerToggle={this.handleDrawerToggle}
            routes={routeCategories}
          />
          <main className={classes.main}>
            {this.renderSwitchRoutes(routeCategories)}
          </main>
          <BottomNavigator />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  routeCategories: getRouteCategories(state),
});

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, {}),
  withStyles(styles)
)(Dashboard);
