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
    flex: 15,
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

  bagElem: {
    borderTop: '1px solid #f0f0f0',
    padding: theme.spacing(2, 0),
    verticalAlign: 'top',
    position: 'relative',
    '&:first-child': {
      border: 'none',
    },
  },
  bagElemImageSec: {
    display: 'inline-block',
    width: '18vw',
    height: '18vw',
  },
  bagElemImage: {
    width: '100%',
    height: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'auto 100%',
    backgroundRepeat: 'no-repeat',
  },
  bagElemTitleSec: {
    display: 'inline-block',
    width: '45vw',
    padding: theme.spacing(1, 1, 0),
  },
  bagElemQtySec: {
    display: 'inline-block',
    width: '8vw',
    padding: theme.spacing(1, 0, 0),
  },
  bagElemTitleSpan: {
    verticalAlign: 'middle',
    fontSize: '0.85rem',
    lineHeight: '1rem',
  },
  bagElemNote: {
    fontSize: '0.7rem',
    color: '#999',
  },
  bagElemPrice: {
    fontSize: '0.85rem',
    color: '#20AB2C',
    textAlign: 'right',
  },
  totalPriceText1: {
    fontSize: '1rem',
    fontWeight: '300',
    color: '#333',
  },
  totalPriceText2: {
    fontSize: '1.5rem',
    fontWeight: 'normal',
    color: '#20AB2C',
  },
  infoSec: {
    marginBottom: theme.spacing(5),
  },
  paymentTitleSec: {
    marginBottom: theme.spacing(3),
  },
  paymentTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
  },
  paymentInfoElem: {
    padding: theme.spacing(0.5),
  },
  paymentInfoElemLabel: {
    display: 'inline-block',
    verticalAlign: 'middle',
    fontSize: '1rem',
    fontWeight: '300',
    color: '#999',
    textAlign: 'right',
    width: '40%',
    paddingRight: theme.spacing(2),
  },
  paymentInfoElemValue: {
    display: 'inline-block',
    verticalAlign: 'middle',
    fontSize: '1rem',
    fontWeight: '300',
    color: '#333',
    width: '55%',
  },
  trackBtnSec: {
    margin: theme.spacing(4, 0),
    textAlign: 'center'
  },
});

class OrderDetail extends React.Component {
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

  renderBags() {
    const { classes } = this.props;
    const { order } = this.state;

    var bagElems = [];
    if (order && order.bags && order.bags.length > 0) {
      const bags = order.bags;
      bags.map((bag) => {
        console.log('-- bag : ', bag);
        bagElems.push(
          <Grid container className={classes.bagElem} key={bag.foodId}>
            <div className={classes.bagElemImageSec}>
              <Box
                className={classes.bagElemImage}
                style={{
                  backgroundImage:
                    'url(' + config.serverUrl + bag.food.image + ')',
                }}
              ></Box>
            </div>

            <div className={classes.bagElemTitleSec}>
              <Typography
                component="p"
                variant="h6"
                className={classes.bagElemTitleSpan}
              >
                {bag.food.trans[0].title}
              </Typography>
              <Typography
                component="p"
                variant="h6"
                className={classes.bagElemNote}
              >
                Notes: {bag.note ? bag.note : ''}
              </Typography>
            </div>

            <div className={classes.bagElemQtySec}>&times; {bag.qty}</div>
            <div
              style={{
                display: 'inline-block',
                width: 'calc( 100% - 71vw - 16px )',
                padding: '8px 0 0 0',
              }}
            >
              <Typography
                component="p"
                variant="h6"
                className={classes.bagElemPrice}
              >
                {bag.food ? bag.currency + bag.price * bag.qty : ''}
              </Typography>
            </div>
          </Grid>
        );
      });
    }

    return (
      <div>
        {bagElems}
        {order && (
          <div style={{ padding: '12px 0' }}>
            <div
              style={{
                borderTop: '2px dashed #ddd',
                justifyContent: 'space-between',
                display: 'flex',
                padding: '12px 0 30px',
              }}
            >
              <span className={classes.totalPriceText1}>TOTAL</span>
              <span className={classes.totalPriceText2}>
                {order.currency}
                {order.price}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    const { me, order } = this.state;

    var cardIcon = '';
    if (order) {
      cardIcon = '/images/MasterCard_Logo.svg.png';
      if (order.cardType == 'visa') cardIcon = '/images/visa_PNG30.png';
      else if (order.cardType == 'knet') cardIcon = '/images/knet-icon.png';
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
              Order Detail
            </Typography>
          </div>
          {order && (
            <div className={classes.mainSec}>
              <div className={classes.tabPanel}>{this.renderBags()}</div>
              <div className={classes.infoSec}>
                <div className={classes.paymentTitleSec}>
                  <Typography
                    component="p"
                    variant="h6"
                    className={classes.paymentTitle}
                  >
                    Order Information
                  </Typography>
                </div>
                <div className={classes.paymentInfoElem}>
                  <div className={classes.paymentInfoElemLabel}>
                    Card Type :
                  </div>
                  <div className={classes.paymentInfoElemValue}>
                    <img src={cardIcon} />
                  </div>
                </div>
                <div className={classes.paymentInfoElem}>
                  <div className={classes.paymentInfoElemLabel}>
                    Card Number :
                  </div>
                  <div className={classes.paymentInfoElemValue}>
                    {order.cardNumber}
                  </div>
                </div>
                <div className={classes.paymentInfoElem}>
                  <div className={classes.paymentInfoElemLabel}>
                    Holder Name :
                  </div>
                  <div className={classes.paymentInfoElemValue}>
                    {order.holderName}
                  </div>
                </div>
                <div className={classes.paymentInfoElem} style={{marginTop: '10px'}}>
                  <div className={classes.paymentInfoElemLabel}>
                    Delivery Style :
                  </div>
                  <div className={classes.paymentInfoElemValue}>
                    {order.deliveryStyle}
                  </div>
                </div>
                <div className={classes.paymentInfoElem} style={{marginTop: '10px'}}>
                  <div className={classes.paymentInfoElemLabel}>
                    Order Status :
                  </div>
                  <div className={classes.paymentInfoElemValue}>
                    {order.status}
                  </div>
                </div>
              </div>

              <div className={classes.trackBtnSec}>
                <Button
                  color="primary"
                  variant="contained"
                  className={classes.trackBtn}
                  onClick={() => {this.props.history.push(`/profile/ordertrack/${order._id}`)}}
                >
                  Track Order
                </Button>
              </div>
            </div>
          )}
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
)(OrderDetail);
