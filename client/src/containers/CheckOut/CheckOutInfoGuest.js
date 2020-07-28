import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
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
  infoContentSec: {
    marginTop: '15px',
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
  bagElem: {
    borderTop: '1px solid #f0f0f0',
    padding: theme.spacing(2, 0),
    verticalAlign: 'top',
    position: 'relative',
    '&:first-child': {
      border: 'none',
    },
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
  cardTypeSelect: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
  },
});

class CheckOutInfoGuest extends React.Component {
  constructor(props) {
    super();

    this.state = {
      bags: null,
      cardType: '',
      deliveryStyle: 'now',
      branches: null,
      totalPrice: 0,
      currency: '',
    };

    this.updateBags = this.updateBags.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onSelectCardType = this.onSelectCardType.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.errorClose = this.errorClose.bind(this);
  }

  componentWillMount() {
    this.props.getBranches().then(() => {
      if (this.props.errorMessageBranch) {
        console.log('-- error : ', this.props.errorMessageBranch);
        return;
      }
      this.setState({ branches: this.props.branches });
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

  onSelectCardType(cardType) {
    this.setState({ cardType });
  }

  onSubmit() {
    const { me } = this.props;
    const { bags, deliveryStyle, cardType, totalPrice, currency } = this.state;

    var newBags = bags.map((bag) => {
      var { userId, foodId, price, currency, qty, note } = bag;
      return { userId, foodId, price, currency, qty, note };
    });
    newBags = JSON.stringify(newBags);

    if (!cardType) {
      this.setState({
        isError: true,
        errorMessage: 'Please select card type',
      });
      return;
    }

    var orderInfo = {
      userId: me.id,
      cardType: cardType,
      deliveryStyle: deliveryStyle,
      price: totalPrice,
      currency: currency,
    };

    this.props.changeOrderInitialValue(orderInfo);
    var that = this;
    setTimeout(function () {
      var orderInitialValue = that.props.orderInitialValue;
      
      if (orderInitialValue.firstName == '') {
        that.props.history.push('/checkout/result/fail');
        return;
      }

      that.props.addOrder(me.id, orderInitialValue, newBags).then(() => {
        if (that.props.errorMessageOrder) {
          console.log('-- error : ', that.props.errorMessageOrder);
          that.props.history.push('/checkout/result/fail');
          return;
        }

        var order = that.props.order;
        if (order._id) {
          that.props.history.push(`/checkout/result/success`);
        } else {
          that.props.history.push('/checkout/result/fail');
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

  renderGuestContactInfo() {
    const { classes, me } = this.props;
    const { bags } = this.state;

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
        </div>
        <div className={classes.infoContentSec}>
          <Grid container>
            <Grid xs={6} item>
              <Field
                name="firstName"
                label="First Name"
                id="firstName"
                autoComplete="firstName"
                component={this.renderTextField}
              />
            </Grid>
            <Grid xs={6} item>
              <Field
                name="lastName"
                label="Last Name"
                id="lastName"
                autoComplete="lastName"
                component={this.renderTextField}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={6} item>
              <Field
                name="phone"
                label="Phone"
                id="phone"
                autoComplete="phone"
                component={this.renderTextField}
              />
            </Grid>
            <Grid xs={6} item>
              <Field
                name="email"
                label="Email"
                id="email"
                autoComplete="email"
                component={this.renderTextField}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} item>
              <Field
                name="address"
                label="Address"
                id="address"
                autoComplete="address"
                component={this.renderTextAreaField}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

  renderGuestPaymentInfo() {
    const { classes, me } = this.props;
    const { bags } = this.state;

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
        </div>
        <div className={classes.infoContentSec}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div
              className={classes.paymentElem}
              style={{
                border:
                  this.state.cardType == 'visa'
                    ? '1px solid #E5293E'
                    : '1px solid #e0e0e0',
              }}
              onClick={this.onSelectCardType.bind(this, 'visa')}
            >
              <img src="/images/visa_PNG30.png" />
              {this.state.cardType == 'visa' && (
                <img
                  src="/images/Checkbox-1.png"
                  className={classes.cardTypeSelect}
                />
              )}
            </div>
            <div
              className={classes.paymentElem}
              style={{
                border:
                  this.state.cardType == 'mastercard'
                    ? '1px solid #E5293E'
                    : '1px solid #e0e0e0',
              }}
              onClick={this.onSelectCardType.bind(this, 'mastercard')}
            >
              <img src="/images/MasterCard_Logo.svg.png" />
              {this.state.cardType == 'mastercard' && (
                <img
                  src="/images/Checkbox-1.png"
                  className={classes.cardTypeSelect}
                />
              )}
            </div>
            <div
              className={classes.paymentElem}
              style={{
                border:
                  this.state.cardType == 'knet'
                    ? '1px solid #E5293E'
                    : '1px solid #e0e0e0',
              }}
              onClick={this.onSelectCardType.bind(this, 'knet')}
            >
              <img src="/images/knet-icon.png" />
              {this.state.cardType == 'knet' && (
                <img
                  src="/images/Checkbox-1.png"
                  className={classes.cardTypeSelect}
                />
              )}
            </div>
          </div>
          <div style={{ paddingTop: '20px' }}>
            <Grid container>
              <Grid xs={12} item>
                <Field
                  name="holderName"
                  label="Cardholder Name"
                  id="holderName"
                  autoComplete="holderName"
                  component={this.renderTextField}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={12} item>
                <Field
                  name="cardNumber"
                  label="Card Number"
                  id="cardNumber"
                  autoComplete="cardNumber"
                  component={this.renderTextField}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={6} item>
                <Field
                  name="expireDate"
                  label="Card Expiration"
                  id="expireDate"
                  autoComplete="expireDate"
                  component={this.renderTextField}
                />
              </Grid>
              <Grid xs={6} item>
                <Field
                  name="cvv"
                  label="CVV"
                  id="cvv"
                  autoComplete="cvv"
                  component={this.renderTextField}
                />
              </Grid>
            </Grid>
          </div>
        </div>
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
              {this.renderGuestContactInfo()}
              {this.renderGuestPaymentInfo()}

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
  errors.firstName = required(values.firstName);
  errors.lastName = required(values.lastName);
  errors.phone = required(values.phone);
  errors.email = required(values.email) || email(values.email);
  errors.address = required(values.address);
  errors.holderName = required(values.holderName);
  errors.cardNumber = required(values.cardNumber);
  errors.expireDate = required(values.expireDate);
  errors.cvv = required(values.address);
  errors.branchId = required(values.branchId);
  errors.deliveryTime = required(values.deliveryTime);
  return errors;
};

export default compose(
  connect(mapStateToProps, { changeOrderInitialValue, addOrder, getBranches }),
  reduxForm({ form: 'checkout', validate }),
  withStyles(styles)
)(CheckOutInfoGuest);
