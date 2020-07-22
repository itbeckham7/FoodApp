import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { ChevronRight } from 'mdi-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getCurrentUser,
  getSignedInWith,
  getOrderOrders,
  getOrderProcessing,
  getOrderError,
} from '../../store/selectors';
import { getOrders } from '../../store/actions';
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
  orderElem: {
    verticalAlign: 'top',
  },
  orderElemLeft: {
    display: 'inline-block',
    width: '90%',
    verticalAlign: 'top',
    padding: theme.spacing(1.5, 1.5, 1.5, 0),
  },
  orderElemRight: {
    display: 'inline-block',
    width: '9%',
    verticalAlign: 'top',
  },
  orderElemTitle: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginBottom: '5px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  orderElemDate: {
    color: '#666',
    fontWeight: '300',
    fontSize: '0.8rem',
    marginBottom: '5px',
  },
  orderElemInfo: {
    color: '#333',
    fontWeight: '300',
    fontSize: '0.8rem',
  },
});

class OrderHistory extends React.Component {
  constructor(props) {
    super();
    this.state = {
      me: props.me,
      orders: null,
    };

    this.onClickOrderElem = this.onClickOrderElem.bind(this);
  }

  componentWillMount() {
    const { me } = this.props;

    this.props.getOrders(me.id).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        return;
      }

      var orders = this.props.orders;
      this.setState({ orders });
    });
  }

  onClickOrderElem(orderInfo) {
    console.log('-- orderInfo : ', orderInfo)
    this.props.history.push(`/profile/orderdetail/${orderInfo._id}`)
  }

  renderOrders() {
    const { classes } = this.props;
    const { orders } = this.state;
    console.log('-- orders : ', orders);
    if (orders && orders.length > 0) {
      var orderElems = [];
      orders.map((order) => {
        var createTime = new Date(order.createdAt).toString();

        orderElems.push(
          <div className={classes.orderElem} key={order._id}>
            <div
              className={classes.orderElemLeft}
              onClick={this.onClickOrderElem.bind(this, order)}
            >
              <div className={classes.orderElemTitle}>
                <span>{order.orderId}</span>
                <span className={classes.orderElemDate}>
                  created at : {getTimeString(order.createdAt, 'd m')}
                </span>
              </div>
              <div className={classes.orderElemInfo}>
                <div>
                  <span>
                    Price : {order.currency}
                    {order.price}
                  </span>
                </div>
                <div>
                  <span>Status : {order.status}</span>
                </div>
              </div>
            </div>
            <div className={classes.orderElemRight}>
              <IconButton
                color="#333"
                onClick={this.onClickOrderElem.bind(this, order)}
              >
                <ChevronRight />
              </IconButton>
            </div>
          </div>
        );
      });
      return <div>{orderElems}</div>;
    } else {
      return <div className={classes.noOrder}>There are no orders.</div>;
    }
  }

  render() {
    const { classes } = this.props;
    const {
      me,
      isVisibleAddAddressDlg,
      isVisibleUpdateAddressDlg,
      selectAddress,
    } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div className={classes.topSec}>
            <Typography
              component="p"
              variant="h6"
              className={classes.pageTitle}
            >
              Order History
            </Typography>
          </div>
          <div className={classes.mainSec}>
            <div className={classes.tabPanel}>{this.renderOrders()}</div>
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
    orders: getOrderOrders(state),
  };
};

export default compose(
  connect(mapStateToProps, {
    getOrders,
  }),
  withStyles(styles)
)(OrderHistory);
