import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import { Switch, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Navigator from '../components/Navigator';
import CheckoutHeader from '../components/CheckoutHeader';
import BottomNavigator from '../components/BottomNavigator';
import ProtectedRoute from '../components/accessControl/ProtectedRoute';
import { getRouteCategories, getLangLang } from '../store/selectors';
import * as translation from '../trans';

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
  bottomNav: {},
});

class Dashboard extends React.Component {

  constructor(props) {
    super();
    
    var lang = props.lang ? props.lang.abbr.toLowerCase() : 'en';
    this.state = {
      mobileOpen: false,
      _t: translation[lang],
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { lang } = this.props;

    if (
      (!lang && nextProps.lang) ||
      (lang && nextProps.lang && lang.abbr !== nextProps.lang.abbr)
    ) {
      this.setState({
        _t: translation[nextProps.lang.abbr.toLowerCase()],
      });
    }
  }

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
    const { classes, routeCategories, lang } = this.props;
    const { mobileOpen } = this.state;

    var direction = lang && lang.abbr === 'AR' ? 'rtl' : 'ltr'

    return (
      <div className={classes.root} style={{direction: direction}}>
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
          <CheckoutHeader
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
  lang: getLangLang(state),
});

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, {}),
  withStyles(styles)
)(Dashboard);
