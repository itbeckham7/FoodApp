import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import csc from 'country-state-city';
import Bags from './Bags';
import {
  getBags,
  deleteBag,
  getActiveAddress,
  getActiveCard,
  changeOrderInitialValue,
  addOrder,
  getBranches,
} from '../../store/actions';
import {
  getBagBags,
  getBagProcessing,
  getBagError,
  getCurrentUser,
  getAddressActiveAddress,
  getCardActiveCard,
  getOrderOrders,
  getOrderOrder,
  getOrderProcessing,
  getOrderError,
  getCardError,
  getOrderInitialValue,
  getBranchBranches,
  getBranchProcessing,
  getBranchError,
  getSettingSetting,
} from '../../store/selectors';
import { email, minLength, required } from '../../utils/formValidator';
import config from '../../config';
import { getTimeString, getExtraPrice } from '../../utils';

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
  totalPriceSec: {
    width: '100%',
    padding: theme.spacing(0, 2),
    position: 'absolute',
    bottom: '-5px',
  },
  mainSec: {
    flex: 3.5,
    width: '100%',
    overflowY: 'auto',
    backgroundColor: '#fff',
  },
  infoSec: {
    padding: theme.spacing(1, 3, 5),
  },
  infoTitleSec: {
    verticalAlign: 'middle',
  },
  infoSecNum: {
    display: 'inline-block',
    backgroundColor: '#0B2031',
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    textAlign: 'center',
    paddingTop: '0.1rem',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '300',
  },
  infoSecTitle: {
    display: 'inline-block',
    color: '#0B2031',
    fontSize: '1.1rem',
    fontWeight: 'normal',
    marginLeft: theme.spacing(2),
  },
  infoSecEdit: {
    display: 'inline-block',
    color: '#E4283D',
    fontSize: '0.8rem',
    fontWeight: '300',
    float: 'right',
  },
  infoContentSec: {
    marginTop: '15px',
  },
  infoLabel: {
    color: '#AFAFAF',
    fontSize: '0.8rem',
    fontWeight: '300',
  },
  infoValue: {
    color: '#0B2031',
    fontSize: '0.8rem',
    fontWeight: '300',
  },
  paymentElem: {
    width: '30%',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    textAlign: 'center',
    padding: '20px 0',
    backgroundColor: '#fff',
    position: 'relative',
  },
  foodImage: {
    borderRadius: '8px',
    width: '100%',
    height: '130px',
  },

  bannerElem: {
    borderRadius: '10px',
    boxShadow: '0 0 10px 3px rgba(0,0,0,0.1)',
    marginTop: '10px',
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
  bagListSec: {
    width: '100%',
    paddingTop: theme.spacing(1),
    boxShadow: '0 0 10px 3px rgba(0,0,0,0.1)',
  },
  bagDeleteBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: '#999',
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
  deliveryBtn: {
    width: '41vw',
    margin: theme.spacing(1, 0, 1, 0),
  },

  checkoutBtnSec: {
    padding: theme.spacing(0, 3, 3),
  },
  roundBtn: {
    borderRadius: '50px',
    marginTop: '10px',
    backgroundColor: '#E5293E',
    '&:hover,&:focus': {
      backgroundColor: '#E5293E',
    },
  },
  roundBtnOutlined: {
    borderRadius: '50px',
    marginTop: '10px',
    // backgroundColor: '#E5293E',
    '&:hover,&:focus': {
      // backgroundColor: '#E5293E',
    },
  },
  noCards: {
    fontSize: '0.9rem',
    fontWeight: '300',
    color: '#999',
    verticalAlign: 'middle',
  },
});

class CheckOutInfoUser extends React.Component {
  constructor(props) {
    super();

    this.state = {
      bags: null,
      deliveryStyle: 'now',
      branches: null,
      totalPrice: 0,
      currency: '',
    };

    this.updateBags = this.updateBags.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.errorClose = this.errorClose.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
  }

  componentWillMount() {
    this.props.getBranches().then(() => {
      if (this.props.errorMessageBranch) {
        console.log('-- error : ', this.props.errorMessageBranch);
        return;
      }
      this.setState({ branches: this.props.branches });
    });
    this.props.getActiveAddress(this.props.me.id).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        return;
      }
    });
    this.props.getActiveCard(this.props.me.id).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        return;
      }
    });
  }

  updateBags(bags) {
    var totalPrice = 0;
    var currency = '';

    if (bags && bags.length > 0) {
      bags.map((bag) => {
        currency = bag.currency;
        totalPrice += (bag.price + getExtraPrice(bag.bagExtras)) * bag.qty;
      });
    }

    this.setState({ bags, totalPrice, currency });
  }

  onSubmit() {
    const { me, activeAddress, activeCard } = this.props;
    const { bags, deliveryStyle, totalPrice, currency } = this.state;

    var newBags = bags.map((bag) => {
      var { userId, foodId, price, currency, qty, note } = bag;
      return { userId, foodId, price, currency, qty, note };
    });
    newBags = JSON.stringify(newBags);

    if (!activeAddress) {
      this.setState({
        isError: true,
        errorMessage: 'Please add your address',
      });
      return;
    }
    if (!activeCard) {
      this.setState({
        isError: true,
        errorMessage: 'Please add your card',
      });
      return;
    }

    var country = csc.getCountryById(activeAddress.countryId);
    var state = csc.getStateById(activeAddress.stateId);
    var city = csc.getCityById(activeAddress.cityId);
    var addressInfo = `${activeAddress.address}, ${city.name}, ${state.name}, ${country.name}`;

    var orderInfo = {
      userId: me.id,
      firstName: me.firstName,
      lastName: me.lastName,
      phone: me.phone,
      email: me.email,
      address: addressInfo,
      cardType: activeCard.cardType,
      holderName: activeCard.holderName,
      cardNumber: activeCard.cardNumber,
      expireDate: activeCard.expireDate,
      cvv: activeCard.cvv,
      deliveryStyle: deliveryStyle,
      price: totalPrice,
      currency: currency,
    };

    this.props.changeOrderInitialValue(orderInfo);
    var that = this;
    setTimeout(function () {
      var orderInitialValue = that.props.orderInitialValue;
      
      if (orderInitialValue.firstName == '') {
        // that.props.history.push('/checkout/result/fail');
        return;
      }

      that.props.addOrder(me.id, orderInitialValue, newBags).then(() => {
        if (that.props.errorMessageOrder) {
          console.log('-- error : ', that.props.errorMessageOrder);
          // that.props.history.push('/checkout/result/fail');
          return;
        }

        var order = that.props.order;
        if (order._id) {
          that.props.history.push(`/checkout/result/success`);
        } else {
          // that.props.history.push('/checkout/result/fail');
        }
      });
    }, 200);
  }

  errorClose() {
    this.setState({
      isError: false,
    });
  }

  onChangeValue(input, meta, e) {
    var changeValue = {};
    changeValue[input.name] = e.target.value;
    this.props.changeOrderInitialValue(changeValue);
  }

  renderTextField = ({ input, label, meta, ...custom }) => (
    <TextField
      label={label}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
      variant="outlined"
      margin="none"
      required
      fullWidth
      {...input}
      {...custom}
      onChange={this.onChangeValue.bind(this, input, meta)}
      style={{ padding: '5px' }}
    />
  );

  renderDatetimeField = ({ input, label, meta, ...custom }) => (
    <TextField
      label={label}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
      type="datetime-local"
      variant="outlined"
      margin="none"
      required
      fullWidth
      {...input}
      {...custom}
      onChange={this.onChangeValue.bind(this, input, meta)}
      style={{ padding: '5px' }}
    />
  );

  renderTextAreaField = ({ input, label, meta, ...custom }) => (
    <TextField
      label={label}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
      multiline={true}
      rows={4}
      fullWidth
      variant="outlined"
      margin="none"
      required
      fullWidth
      {...input}
      {...custom}
      onChange={this.onChangeValue.bind(this, input, meta)}
      style={{ height: '100px', padding: '5px' }}
    />
  );

  renderBranchField = ({ input, label, meta, ...custom }) => {
    const { classes } = this.props;
    const { branches } = this.state;

    var branchesElem = [
      <MenuItem key={'country-none'} value="">
        <em>None</em>
      </MenuItem>,
    ];
    branches.map((branch) => {
      branchesElem.push(
        <MenuItem key={branch._id} value={branch._id}>
          {branch.name}
        </MenuItem>
      );
    });

    return (
      <TextField
        select
        label={label}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
        variant="outlined"
        fullWidth
        {...input}
        {...custom}
        onChange={this.onChangeValue.bind(this, input, meta)}
        style={{ marginBottom: '10px', padding: '5px' }}
      >
        {branchesElem}
      </TextField>
    );
  };

  renderUserContactInfo() {
    const { classes, me, activeAddress } = this.props;
    
    var addressInfo = '';
    if (activeAddress) {
      var country = csc.getCountryById(activeAddress.countryId);
      var state = csc.getStateById(activeAddress.stateId);
      var city = csc.getCityById(activeAddress.cityId);
      addressInfo = `${activeAddress.address}, ${city.name}, ${state.name}, ${country.name}`;
    }
    return (
      <div
        className={classes.infoSec}
        style={{
          backgroundColor: '#fff',
        }}
      >
        <div className={classes.infoTitleSec}>
          <span className={classes.infoSecNum}>1</span>
          <Typography
            component="span"
            variant="h6"
            className={classes.infoSecTitle}
          >
            Contact Info
          </Typography>
          <Button
            size="small"
            className={classes.infoSecEdit}
            onClick={() => {
              this.props.history.push('/profile/general');
            }}
          >
            Edit
          </Button>
        </div>
        <div className={classes.infoContentSec}>
          <div style={{ marginBottom: '15px' }}>
            <div className={classes.infoLabel}>NAME</div>
            <div className={classes.infoValue}>
              {me.firstName} {me.lastName}
            </div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <div className={classes.infoLabel}>PHONE NUMBER</div>
            <div className={classes.infoValue}>{me.phone}</div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <div className={classes.infoLabel}>EMAIL</div>
            <div className={classes.infoValue}>{me.email}</div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <div className={classes.infoLabel}>ADDRESS</div>
            <div className={classes.infoValue}>{addressInfo}</div>
            <div>
              <Button
                variant="contained"
                size="small"
                color="primary"
                className={classes.roundBtn}
                onClick={() => {
                  this.props.history.push('/profile/address');
                }}
              >
                Change Address
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderUserPaymentInfo() {
    const { classes, me, activeCard } = this.props;

    var contentElem = (
      <div className={classes.noCards} style={{ textAlign: 'center' }}>
        There are no cards.
      </div>
    );
    if (activeCard) {
      var cardImage =
        activeCard.cardType == 'mastercard'
          ? '/images/MasterCard_Logo.svg.png'
          : activeCard.cardType == 'visa'
          ? '/images/visa_PNG30.png'
          : '/images/knet-icon.png';

      contentElem = (
        <Grid container>
          <Grid xs={12} item style={{ marginBottom: '30px' }}>
            <img
              src={cardImage}
              style={{ marginRight: '20px', verticalAlign: 'middle' }}
            />
            <Typography
              component="span"
              variant="h6"
              className={classes.noCards}
            >
              You will need to confirm the payment
            </Typography>
          </Grid>
          <Grid xs={6} item style={{ marginBottom: '10px' }}>
            <div className={classes.infoLabel}>Cardholder Name</div>
            <div className={classes.infoValue}>{activeCard.holderName}</div>
          </Grid>
          <Grid xs={6} item style={{ marginBottom: '10px' }}>
            <div className={classes.infoLabel}>Card Number</div>
            <div className={classes.infoValue}>{activeCard.cardNumber}</div>
          </Grid>
          <Grid xs={6} item>
            <div className={classes.infoLabel}>Expiration Date</div>
            <div className={classes.infoValue}>{activeCard.expireDate}</div>
          </Grid>
          <Grid xs={6} item>
            <div className={classes.infoLabel}>CVV</div>
            <div className={classes.infoValue}>{activeCard.cvv}</div>
          </Grid>
        </Grid>
      );
    }

    return (
      <div
        className={classes.infoSec}
        style={{
          paddingTop: '40px',
          paddingBottom: '40px',
        }}
      >
        <div className={classes.infoTitleSec}>
          <span className={classes.infoSecNum}>2</span>
          <Typography
            component="span"
            variant="h6"
            className={classes.infoSecTitle}
          >
            Payment Info
          </Typography>
          <Button
            size="small"
            className={classes.infoSecEdit}
            onClick={() => {
              this.props.history.push('/profile/card');
            }}
          >
            Edit
          </Button>
        </div>
        <div className={classes.infoContentSec}>{contentElem}</div>
      </div>
    );
  }

  render() {
    const { classes, me, handleSubmit, setting } = this.props;
    const {
      bags,
      deliveryStyle,
      isError,
      errorMessage,
      totalPrice,
      currency,
    } = this.state;

    var curTime = new Date().toString();
    curTime = curTime.split(' ');
    curTime = curTime[4];
    var isWorkingTime = true;
    var startTime =
      setting && setting.startTime ? setting.startTime + ':00' : null;
    var endTime = setting && setting.endTime ? setting.endTime + ':00' : null;
    
    if (startTime && curTime < startTime) {
      isWorkingTime = false;
    } else if (endTime && curTime > endTime) {
      isWorkingTime = false;
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
                {getTimeString('now', 'd m, y')}
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
            <form onSubmit={handleSubmit(this.onSubmit)}>
              {this.renderUserContactInfo()}
              {this.renderUserPaymentInfo()}

              <Bags updateBags={this.updateBags} />

              <div
                className={classes.infoSec}
                style={{
                  paddingTop: '20px',
                  paddingBottom: '20px',
                }}
              >
                <div className={classes.infoTitleSec}>
                  <span className={classes.infoSecNum}>4</span>
                  <Typography
                    component="span"
                    variant="h6"
                    className={classes.infoSecTitle}
                  >
                    Style of delivery
                  </Typography>
                </div>
                <div className={classes.infoContentSec}>
                  <div
                    style={{
                      verticalAlign: 'middle',
                    }}
                  >
                    {isWorkingTime && (
                      <Button
                        variant="contained"
                        color={deliveryStyle == 'now' ? 'primary' : 'default'}
                        className={classes.deliveryBtn}
                        onClick={() => this.setState({ deliveryStyle: 'now' })}
                        style={{ marginRight: '4vw' }}
                      >
                        Now
                      </Button>
                    )}

                    <Button
                      color={deliveryStyle == 'pickup' ? 'primary' : 'default'}
                      variant="contained"
                      className={classes.deliveryBtn}
                      onClick={() => this.setState({ deliveryStyle: 'pickup' })}
                      style={{ marginRight: isWorkingTime ? '0' : '4vw' }}
                    >
                      Pickup
                    </Button>
                    <Button
                      color={deliveryStyle == 'later' ? 'primary' : 'default'}
                      variant="contained"
                      className={classes.deliveryBtn}
                      onClick={() => this.setState({ deliveryStyle: 'later' })}
                    >
                      Later
                    </Button>
                  </div>

                  <Grid container style={{ marginTop: '20px' }}>
                    {deliveryStyle == 'pickup' && (
                      <Grid xs={12} item>
                        <Field
                          name="branchId"
                          label="Branch"
                          id="branchId"
                          autoComplete="branchId"
                          component={this.renderBranchField}
                        />
                      </Grid>
                    )}
                    {(deliveryStyle == 'pickup' ||
                      deliveryStyle == 'later') && (
                      <Grid xs={12} item>
                        <Field
                          name="deliveryTime"
                          label="Delivery Time"
                          id="deliveryTime"
                          autoComplete="deliveryTime"
                          component={this.renderDatetimeField}
                        />
                      </Grid>
                    )}
                  </Grid>
                </div>
              </div>

              <div className={classes.checkoutBtnSec}>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  fullWidth
                  type="submit"
                  className={classes.roundBtn}
                >
                  Confirm
                </Button>
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
            </form>
          </div>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={isError}
          autoHideDuration={6000}
          onClose={this.errorClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={this.errorClose}
            severity="error"
          >
            {errorMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {

  return {
    isProcessing: getBagProcessing(state),
    errorMessage: getBagError(state),
    me: getCurrentUser(state),
    activeAddress: getAddressActiveAddress(state),
    activeCard: getCardActiveCard(state),
    isProcessingOrder: getOrderProcessing(state),
    errorMessageOrder: getOrderError(state),
    orderInitialValue: getOrderInitialValue(state),
    order: getOrderOrder(state),
    isProcessingBranch: getBagProcessing(state),
    errorMessageBranch: getOrderError(state),
    branches: getBranchBranches(state),
    initialValues: state.order.orderInitialValue,
    enableReinitialize: true,
    setting: getSettingSetting(state),
  };
};

const validate = (values) => {
  const errors = {};
  errors.branchId = required(values.branchId);
  errors.deliveryTime = required(values.deliveryTime);
  return errors;
};

export default compose(
  connect(mapStateToProps, {
    getBags,
    deleteBag,
    getActiveAddress,
    getActiveCard,
    changeOrderInitialValue,
    addOrder,
    getBranches,
  }),
  reduxForm({ form: 'checkout', validate }),
  withStyles(styles)
)(CheckOutInfoUser);
