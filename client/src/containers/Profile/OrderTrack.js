import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getCurrentUser,
  getSignedInWith,
  getOrderOrder,
  getOrderProcessing,
  getOrderError,
  getLangLang,
} from '../../store/selectors';
import { getOrder } from '../../store/actions';
import { getTimeString } from '../../utils/textUtils';
import * as translation from '../../trans';

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

    var lang = props.lang ? props.lang.abbr.toLowerCase() : 'en';
    this.state = {
      me: props.me,
      order: null,
      _t: translation[lang],
      direction: lang === 'ar' ? 'rtl' : 'ltr',
    };
  }

  componentWillMount() {
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

  componentWillReceiveProps(nextProps, nextState) {
    const { lang } = this.props;

    if (
      (!lang && nextProps.lang) ||
      (lang && nextProps.lang && lang.abbr !== nextProps.lang.abbr)
    ) {
      this.setState({
        _t: translation[nextProps.lang.abbr.toLowerCase()],
        direction: nextProps.lang.abbr === 'AR' ? 'rtl' : 'ltr',
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { order, _t, direction } = this.state;

    if (!order) return <div></div>;

    var rightStyle =
      direction === 'rtl'
        ? { borderRight: '1px solid #ddd', paddingRight: '40px' }
        : { borderLeft: '1px solid #ddd', paddingLeft: '40px' };

    var circleStyle =
      direction === 'rtl' ? { right: '-15px' } : { left: '-15px' };
    var tracks = JSON.parse(order.track);

    var trackElems = [];
    for (var i = 0; i < tracks.history.length; i++) {
      var track = tracks.history[i];
      var nextTrack =
        i < tracks.history.length - 1 ? tracks.history[i + 1] : null;

      trackElems.push(
        <div className={classes.trackElem} key={track.status}>
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
              ...rightStyle,
              borderColor:
                track.time && nextTrack && nextTrack.time ? '#E5293E' : '#ddd',
              borderLeftWidth: nextTrack ? '1px' : '0',
            }}
          >
            <div style={{ marginTop: '-20px' }}>
              <div className={classes.trackElemTitle}>
                {_t.order[track.status]}
              </div>
              {track.address && (
                <div className={classes.trackElemAddress}>{track.address}</div>
              )}
            </div>
            <div
              className={classes.circleSec}
              style={{
                ...circleStyle,
                borderColor: track.time ? '#E5293E' : '#ddd',
              }}
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
    lang: getLangLang(state),
  };
};

export default compose(
  connect(mapStateToProps, {
    getOrder,
  }),
  withStyles(styles)
)(OrderTrack);
