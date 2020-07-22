import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import CheckOutInfoGuest from './CheckOutInfoGuest';
import CheckOutInfoUser from './CheckOutInfoUser';
import {
  getCurrentUser,
} from '../../store/selectors';
import config from '../../config';

const styles = (theme) => ({
  root: {
    height: '100%',
  },
});

class CheckOutInfo extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    const { classes, me } = this.props;

    return (
      <div className={classes.root}>
        {this.props.me.role == 'guest' && <CheckOutInfoGuest history={this.props.history}/>}
        {this.props.me.role != 'guest' && <CheckOutInfoUser history={this.props.history}/>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    me: getCurrentUser(state),
  };
};

export default compose(
  connect(mapStateToProps, {}),
  withStyles(styles)
)(CheckOutInfo);
