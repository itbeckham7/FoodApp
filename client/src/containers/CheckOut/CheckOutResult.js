import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getBags, getOrder, clearBag } from '../../store/actions';
import {
  getBagBags,
  getBagProcessing,
  getBagError,
  getCurrentUser,
  getOrderInitialValue,
  getOrderError,
  getOrderProcessing,
} from '../../store/selectors';
import config from '../../config';

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
    backgroundColor: '#E5293E',
    width: '100%',
    position: 'relative',
    padding: theme.spacing(5, 3, 0),
  },
  pageTitleSec: {
    textAlign: 'center',
    padding: theme.spacing(1, 0),
    marginBottom: theme.spacing(0.5),
    borderBottom: '1px dashed rgba(255,255,255,0.5)',
  },
  pageTitleText: {
    color: '#fff',
    fontWeight: 'normal',
    fontSize: '1.4rem',
  },
  dateSec: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  topDateText: {
    color: '#fff',
    fontWeight: '300',
    fontSize: '0.95rem',
  },
  mainSec: {
    flex: 3.5,
    width: '100%',
    overflowY: 'auto',
  },
  infoSec: {
    padding: theme.spacing(1, 3),
  },
  infoTitleSec: {
    verticalAlign: 'middle',
  },
  paymentStyle: {
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  infoSecTitle: {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: '60vw',
    color: '#0B2031',
    fontSize: '1rem',
    fontWeight: 'normal',
    marginLeft: theme.spacing(2),
    textAlign: 'right',
  },
  resultText: {
    color: '#ccc',
    fontSize: '1.1rem',
    fontWeight: 'normal',
    margin: theme.spacing(1),
  },
  infoContentSec: {
    marginTop: '15px',
  },

  checkoutBtnSec: {
    padding: theme.spacing(5, 3, 3),
  },
  roundBtn: {
    borderRadius: '50px',
    backgroundColor: '#E5293E',
    '&:hover,&:focus': {
      backgroundColor: '#E5293E',
    },
  },
  roundBtnOutlined: {
    borderRadius: '50px',
    marginTop: '20px',
    // backgroundColor: '#E5293E',
    '&:hover,&:focus': {
      // backgroundColor: '#E5293E',
    },
  },
});

class CheckOutResult extends React.Component {
  constructor(props) {
    super();
    this.state = {
      bags: null,
    };
  }

  componentWillMount() {
    this.props.getBags(this.props.me.id).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        this.props.history.push('/dashboard/home');
        return;
      }

      this.setState({
        bags: this.props.bags,
      });

      const result = this.props.match.params.result;
      console.log('-- result : ', result);
      if (result == 'success') {
        this.props.clearBag(this.props.me.id);
      }
    });
  }

  render() {
    const { classes, orderInitialValue } = this.props;
    const { bags } = this.state;
    const result = this.props.match.params.result;

    var totalPrice = 0;
    var currency = '';
    var itemCounts = 0;

    if (bags && bags.length > 0) {
      itemCounts = bags.length;
      bags.map((bag) => {
        currency = bag.currency;
        totalPrice += bag.price * bag.qty;
      });
    }

    var currentDate = new Date();
    currentDate = currentDate.toString();
    currentDate = currentDate.split(' ');
    currentDate =
      currentDate.length > 4
        ? currentDate[1] + ' ' + currentDate[2] + ', ' + currentDate[3]
        : '';

    var cardImage = '';
    var cardNumberElem = [];
    if (orderInitialValue && orderInitialValue.firstName != '') {
      var cardImage =
        orderInitialValue.cardType == 'mastercard'
          ? '/images/MasterCard_Logo.svg.png'
          : orderInitialValue.cardType == 'visa'
          ? '/images/visa_PNG30.png'
          : '/images/knet-icon.png';

      var cardNumber = orderInitialValue.cardNumber;
      for (var i = 0, len = cardNumber.length; i < len; i += 4) {
        var partNum = cardNumber.substring(i, i + 4);
        cardNumberElem.push(
          <span className={classes.cardElemNumberPart}>{partNum}</span>
        );
      }
    }
    console.log('-- orderInitialValue : ', orderInitialValue);
    console.log('-- cardNumberElem : ', cardNumberElem);

    var resultImg = '/images/tick-blue.png';
    var resultText = ' Your confirmation is successful';
    if (result == 'fail') {
      resultImg = '/images/Group-3.png';
      resultText = ' Your confirmation is unsuccessful';
    }
    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div className={classes.topSec}>
            <div className={classes.pageTitleSec}>
              <Typography
                component="p"
                variant="h6"
                className={classes.pageTitleText}
              >
                CHECK OUT
              </Typography>
            </div>
            <div className={classes.dateSec}>
              <Typography
                component="span"
                variant="h6"
                className={classes.topDateText}
              >
                Date:
              </Typography>
              <Typography
                component="span"
                variant="h6"
                className={classes.topDateText}
              >
                {currentDate}
              </Typography>
            </div>
            <div className={classes.dateSec}>
              <Typography
                component="span"
                variant="h6"
                className={classes.topDateText}
              >
                Total Bill:
              </Typography>
              <Typography
                component="span"
                variant="h6"
                className={classes.topDateText}
              >
                {currency}
                {totalPrice}
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
          <div className={classes.mainSec}>
            <div
              className={classes.infoSec}
              style={{
                paddingTop: '0',
                paddingBottom: '20px',
                backgroundColor: '#fff',
              }}
            >
              <div className={classes.infoTitleSec}>
                <span className={classes.paymentStyle}>
                  <img src={cardImage} />
                </span>
                <Typography
                  component="span"
                  variant="h6"
                  className={classes.infoSecTitle}
                >
                  {cardNumberElem}
                </Typography>
              </div>
              <div className={classes.infoContentSec}>
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px',
                  }}
                >
                  <img src={resultImg} />
                  <Typography
                    component="p"
                    variant="h6"
                    className={classes.resultText}
                  >
                    {resultText}
                  </Typography>
                </div>
              </div>
            </div>

            <div className={classes.checkoutBtnSec}>
              {result == 'success' && (
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  fullWidth
                  className={classes.roundBtn}
                  onClick={() => {
                    this.props.history.push('/dashboard/home');
                  }}
                >
                  Home
                </Button>
              )}
              {result == 'fail' && (
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  fullWidth
                  className={classes.roundBtn}
                  onClick={() => {
                    this.props.history.push('/dashboard/home');
                  }}
                >
                  Try Again
                </Button>
              )}
              <Button
                variant="outlined"
                size="large"
                color="primary"
                fullWidth
                className={classes.roundBtnOutlined}
                onClick={() => {
                  window.history.back();
                }}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('-- state : ', state);
  return {
    isProcessing: getBagProcessing(state),
    errorMessage: getBagError(state),
    bags: getBagBags(state),
    me: getCurrentUser(state),
    orderInitialValue: getOrderInitialValue(state),
    isProcessingOrder: getOrderProcessing(state),
    errorMessageOrder: getOrderError(state),
  };
};

export default compose(
  connect(mapStateToProps, { getBags, getOrder, clearBag }),
  withStyles(styles)
)(CheckOutResult);
