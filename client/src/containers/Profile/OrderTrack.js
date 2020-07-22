import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Slide from '@material-ui/core/Slide';
import { ChevronRight } from 'mdi-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getCurrentUser,
  getSignedInWith,
  getOrderOrder,
  getOrderProcessing,
  getOrderError,
} from '../../store/selectors';
import { getOrder } from '../../store/actions';
import config from '../../config';
import { getTimeString } from '../../utils/textUtils';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme) => ({
  root: {
    height: '100%',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  topSec: {
    flex: 1,
    width: '100%',
    position: 'relative',
    padding: theme.spacing(5, 3, 0),
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  mainSec: {
    flex: 10,
    width: '100%',
    overflowY: 'auto',
    padding: theme.spacing(3),
    backgroundColor: '#fff',
  },
  image: {
    backgroundColor: '#f5f5f5',
    width: '30%',
    borderRadius: '100px',
  },
  pageTitle: {
    color: '#333',
    fontSize: '1.3rem',
    fontWeight: 'normal',
    marginTop: theme.spacing(1),
  },
  tabText: {
    fontWeight: '300',
    fontSize: '0.7rem',
  },
  tabPanel: {
    paddingTop: '20px',
  },
  actionBtn: {
    // borderRadius: '50px',
    position: 'absolute',
    right: '30px',
    bottom: '120px',
    padding: theme.spacing(1.5, 3),
  },
  formControl: {
    width: '100%',
  },
  noOrder: {
    textAlign: 'center',
    color: '#333',
    fontWeight: '300',
    fontSize: '1rem',
    padding: '10%',
  },

  trackElem: {},
  trackElemLeft: {
    display: 'inline-block',
    width: '25%',
    verticalAlign: 'top',
  },
  trackElemRight: {
    display: 'inline-block',
    width: '70%',
    verticalAlign: 'top',
    paddingBottom: theme.spacing(10),
    borderLeft: '1px solid #ddd',
    paddingLeft: theme.spacing(5),
    position: 'relative',
  },
  trackElemTime1: {
    color: '#999',
    fontWeight: '300',
    fontSize: '0.9rem',
  },
  trackElemTime2: {
    color: '#999',
    fontWeight: '300',
    fontSize: '0.8rem',
  },
  trackElemTitle: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  trackElemAddress: {
    color: '#333',
    fontWeight: '300',
    fontSize: '0.8rem',
  },
  circleSec: {
    backgroundColor: '#fff',
    width: '30px',
    height: '30px',
    borderRadius: '15px',
    border: '1px solid #ddd',
    position: 'absolute',
    left: '-15px',
    top: '-15px',
    padding: '5px 5px',
    boxSizing: 'border-box',
  },
  circleMark: {
    backgroundColor: '#ddd',
    width: '18px',
    height: '18px',
    borderRadius: '10px',
    boxSizing: 'border-box',
  },
});

class OrderTrack extends React.Component {
  constructor(props) {
    super();
    this.state = {
      me: props.me,
      order: null,
    };
  }

  componentWillMount() {
    const { me } = this.props;
    const orderId = this.props.match.params.orderId;

    this.props.getOrder(orderId).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        return;
      }

      var order = this.props.order;
      this.setState({ order });
    });
  }

  render() {
    const { classes } = this.props;
    const { me, order } = this.state;

    if (!order) return <div></div>;

    var tracks = JSON.parse(order.track);

    var trackElems = [];
    for (var i = 0; i < tracks.history.length; i++) {
      var track = tracks.history[i];
      var nextTrack =
        i < tracks.history.length - 1 ? tracks.history[i + 1] : null;

      trackElems.push(
        <div className={classes.trackElem}>
          <div className={classes.trackElemLeft}>
            {track.time && (
              <div style={{ marginTop: '-20px' }}>
                <div className={classes.trackElemTime1}>
                  {getTimeString(track.time, 'd m')}
                </div>
                <div className={classes.trackElemTime2}>
                  {getTimeString(track.time, 'h:m p')}
                </div>
              </div>
            )}
          </div>
          <div
            className={classes.trackElemRight}
            style={{
              borderColor:
                track.time && nextTrack && nextTrack.time ? '#E5293E' : '#ddd',
              borderLeftWidth: nextTrack ? '1px' : '0',
            }}
          >
            <div style={{ marginTop: '-20px' }}>
              <div className={classes.trackElemTitle}>{track.title}</div>
              {track.address && (
                <div className={classes.trackElemAddress}>{track.address}</div>
              )}
            </div>
            <div
              className={classes.circleSec}
              style={{ borderColor: track.time ? '#E5293E' : '#ddd' }}
            >
              <div
                className={classes.circleMark}
                style={{ backgroundColor: track.time ? '#E5293E' : '#ddd' }}
              ></div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div className={classes.topSec}>
            <Typography
              component="p"
              variant="h6"
              className={classes.pageTitle}
            >
              {tracks.trackId}
            </Typography>
          </div>
          <div className={classes.mainSec}>
            <div className={classes.tabPanel}>{trackElems}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    me: getCurrentUser(state),
    authProvider: getSignedInWith(state),
    order: getOrderOrder(state),
    isProcessing: getOrderProcessing(state),
    errorMessage: getOrderError(state),
  };
};

export default compose(
  connect(mapStateToProps, {
    getOrder,
  }),
  withStyles(styles)
)(OrderTrack);
