import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { requestPasswordReset, unloadAuthPage } from '../../store/actions';
import RequestTokenForm from '../../components/RequestTokenForm';
import * as translation from '../../trans';

class RequestPasswordReset extends React.Component {
  state = {
    trans: translation['en'],
  };

  render() {
    const {trans} = this.state
    return (
      <RequestTokenForm
        tokenPurpose="reset-password"
        title={trans.auth.send_pw_reset_email}
        onSubmit={this.props.requestPasswordReset}
      />
    );
  }

  componentWillUnmount() {
    this.props.unloadAuthPage();
  }
}

export default compose(connect(null, { requestPasswordReset, unloadAuthPage }))(
  RequestPasswordReset
);
