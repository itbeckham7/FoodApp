import React from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import AnonymousRoute from '../../components/accessControl/AnonymousRoute';
import ProtectedRoute from '../../components/accessControl/ProtectedRoute';
import Launch from '../Auth/Launch';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import VerifyEmail from '../Auth/VerifyEmail';
import { tryLocalSignIn, getSetting } from '../../store/actions';
import RequestVerificationEmail from '../Auth/RequestVerificationEmail';
import RequestPasswordReset from '../Auth/RequestPasswordReset';
import ResetPassword from '../Auth/ResetPassword';
import Dashboard from '../../layouts/Dashboard';
import Bag from '../../layouts/Bag';
import CheckOut from '../../layouts/CheckOut';
import CommonPage from '../../layouts/CommonPage';
import Profile from '../../layouts/Profile';
import {
  getIsSignedIn,
  getSettingSetting,
  getSettingProcessing,
  getSettingError,
} from '../../store/selectors';

class App extends React.Component {
  state = {
    isDidMound: false
  }
  componentWillMount() {
    if (this.props.setting == null) {
      this.props.getSetting().then(() => {
        if (this.props.errorMessageSetting) {
          console.log('-- error : ', this.props.errorMessageSetting);
        }
      });
    }
  }

  componentDidMount() {
    this.props.tryLocalSignIn().then(() => {
      console.log('-- tryLocalSignIn end')
      this.setState({isDidMound: true})
    });
  }

  render() {
    var now = (new Date()).getTime();
    console.log('-- isSignedIn : ', this.props.isSignedIn, now)

    if( !this.state.isDidMound ){
      return(<div></div>)
    }

    return (
      <Switch>
        <AnonymousRoute path="/launch" component={Launch} />
        <AnonymousRoute path="/signin" component={SignIn} />
        <AnonymousRoute path="/signup" component={SignUp} />
        <AnonymousRoute path="/verify-email/:token" component={VerifyEmail} />
        <AnonymousRoute
          path="/request-verification-email"
          component={RequestVerificationEmail}
        />
        <AnonymousRoute
          path="/request-password-reset"
          component={RequestPasswordReset}
        />
        <AnonymousRoute
          path="/reset-password/:token"
          component={ResetPassword}
        />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/bag" component={Bag} />
        <ProtectedRoute path="/checkout" component={CheckOut} />
        <ProtectedRoute path="/common" component={CommonPage} />
        <ProtectedRoute path="/profile" component={Profile} />

        {<Route path="/">
          {this.props.isSignedIn ? (
            <Redirect to="/dashboard/home" />
          ) : (
            <Redirect to="/launch" />
          )}
        </Route>}
      </Switch>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: getIsSignedIn(state),
    setting: getSettingSetting(state),
    isProcessingSetting: getSettingProcessing(state),
    errorMessageSetting: getSettingError(state),
  };
};

export default connect(mapStateToProps, { tryLocalSignIn, getSetting })(App);
