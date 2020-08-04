import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { requestVerificationEmail, unloadAuthPage } from '../../store/actions';
import RequestTokenForm from '../../components/RequestTokenForm';
import * as translation from '../../trans';

class RequestVerificationEmail extends React.Component {
  state = {
    trans: translation['en'],
  };

  render() {
    const { trans } = this.state;

    return (
      <RequestTokenForm
        tokenPurpose="verify-email"
        title={trans.auth.resend_verification_email}
        onSubmit={this.props.requestVerificationEmail}
      />
    );
  }

  componentWillUnmount() {
    this.props.unloadAuthPage();
  }
}

export default compose(
  connect(null, { requestVerificationEmail, unloadAuthPage })
)(RequestVerificationEmail);
