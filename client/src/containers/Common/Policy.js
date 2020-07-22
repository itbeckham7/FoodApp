import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getBagBags,
  getBagProcessing,
  getBagError,
  getCurrentUser,
} from '../../store/selectors';
import config from '../../config';
import { textEllipsis } from '../../utils/textUtils';

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
    backgroundColor: '#0B2031',
    width: '100%',
    position: 'relative',
    padding: theme.spacing(12, 3, 0),
  },
  pageTitleSec: {
    textAlign: 'center',
    padding: theme.spacing(1, 0),
    marginBottom: theme.spacing(0.5),
  },
  pageTitleText: {
    color: '#fff',
    fontWeight: 'normal',
    fontSize: '1.4rem',
  },
  mainSec: {
    flex: 4,
    width: '100%',
    overflowY: 'auto',
  },
  infoSec: {
    padding: theme.spacing(1, 3),
  },
  infoTitleSec: {
    textAlign: 'center',
  },
  resultText: {
    color: '#0B2031',
    fontSize: '1.25rem',
    fontWeight: 'normal',
    margin: theme.spacing(5, 3, 3),
  },
  infoContentSec: {
    marginTop: '15px',
  },

});

class AboutUs extends React.Component {
  state = {
  };

  constructor() {
    super();
  }

  componentWillMount() {
  }

  render() {
    const {
      classes,
    } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div  className={classes.topSec}>
            <div className={classes.pageTitleSec}>
              <Typography
                component="p"
                variant="h6"
                className={classes.pageTitleText}
              >
                Policy
              </Typography>
            </div>
            <div
              style={{
                position: 'absolute',
                left: '0',
                bottom: '0',
                width: '100%',
                height: '40px',
                borderTopLeftRadius: '40px',
                borderTopRightRadius: '40px',
                backgroundColor: '#fff',
              }}
            ></div>
          </div>
          <div  className={classes.mainSec}>
            <div
              className={classes.infoSec}
              style={{
                paddingTop: '0',
                paddingBottom: '20px',
                backgroundColor: '#fff',
              }}
            >
              <div className={classes.infoTitleSec}>
                <img src="/images/About-us-page-bro.png" />
              </div>
              <div className={classes.infoContentSec}>
                <Typography
                  component="p"
                  variant="h6"
                  className={classes.resultText}
                >
                  Incanse and paint are carefully selected since the administration was created in 2014.The various perfume that we designing ourselves are the best French oils from their source to ensure quality.we start from Kuwait and connect you with all the gulf countries.Thanks for your trust
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isProcessing: getBagProcessing(state),
    errorMessage: getBagError(state),
    bags: getBagBags(state),
    me: getCurrentUser(state),
  };
};

export default compose(
  connect(mapStateToProps, {}),
  withStyles(styles)
)(AboutUs);
