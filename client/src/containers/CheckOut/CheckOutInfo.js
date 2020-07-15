import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getBags, deleteBag } from '../../store/actions';
import {
  getBagBags,
  getBagProcessing,
  getBagError,
  getCurrentUser,
} from '../../store/selectors';
import { email, minLength, required } from '../../utils/formValidator';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
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
  },
  infoSec: {
    padding: theme.spacing(1, 3),
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
  delieveryBtn: {
    width: '41vw',
    margin: theme.spacing(1, 0, 1, 0),
  },

  checkoutBtnSec: {
    padding: theme.spacing(0, 3, 3)
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
});

class CheckOutInfo extends React.Component {
  state = {
    bags: null,
  };

  constructor() {
    super();
  }

  componentWillMount() {
    this.props.getBags(this.props.me._id).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        return;
      }
      console.log('-- bags : ', this.props.bags);
      this.setState({
        bags: this.props.bags,
      });
    });
  }

  onDeleteBag(bag) {
    console.log('-- onDeleteBag bag : ', bag);
    const { me } = this.props;

    this.props.deleteBag(me._id, bag.foodId).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        return;
      }
      console.log('-- bags : ', this.props.bags);
      this.setState({
        bags: this.props.bags,
      });
    });
  }

  renderBags() {
    const { classes } = this.props;
    const { bags } = this.state;
    console.log('-- renderBags bags : ', bags);

    var bagElems = [];
    if (bags && bags.length > 0) {
      bags.map((bag) => {
        bagElems.push(
          <Grid container className={classes.bagElem}>
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
                {bag.food
                  ? bag.food.trans[0].languageId.currency +
                    bag.food.trans[0].price * bag.qty
                  : ''}
              </Typography>
            </div>
          </Grid>
        );
      });
    }

    return <div>{bagElems}</div>;
  }

  render() {
    const {
      classes,
      handleSubmit,
      pristine,
      submitting,
      valid,
      error,
    } = this.props;
    const { bags } = this.state;

    var totalPrice = 0;
    var currency = '';
    var itemCounts = 0;

    if (bags && bags.length > 0) {
      itemCounts = bags.length;
      bags.map((bag) => {
        currency = bag.food.trans[0].languageId.currency;
        totalPrice += bag.food.trans[0].price * bag.qty;
      });
    }

    var currentDate = new Date();
    currentDate = currentDate.toString();
    currentDate = currentDate.split(' ');
    currentDate =
      currentDate.length > 4
        ? currentDate[1] + ' ' + currentDate[2] + ', ' + currentDate[3]
        : '';
    console.log('-- currentDate : ', currentDate);

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div container className={classes.topSec}>
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
          <div container className={classes.mainSec}>
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
                <Typography
                  component="span"
                  variant="h6"
                  className={classes.infoSecEdit}
                >
                  Edit
                </Typography>
              </div>
              <div className={classes.infoContentSec}>
                <div style={{ marginBottom: '15px' }}>
                  <div className={classes.infoLabel}>NAME</div>
                  <div className={classes.infoValue}>Jenis</div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <div className={classes.infoLabel}>PHONE NUMBER</div>
                  <div className={classes.infoValue}>+086565766</div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <div className={classes.infoLabel}>EMAIL</div>
                  <div className={classes.infoValue}>
                    itbeckham7@hotmail.com
                  </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <div className={classes.infoLabel}>ADDRESS</div>
                  <div className={classes.infoValue}>
                    1783 Ump town 4780, New York
                  </div>
                </div>
              </div>
            </div>

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
                  <div className={classes.paymentElem}>
                    <img src="/images/visa_PNG30.png" />
                  </div>
                  <div className={classes.paymentElem}>
                    <img src="/images/MasterCard_Logo.svg.png" />
                  </div>
                  <div className={classes.paymentElem}>
                    <img src="/images/PayPal.svg.png" />
                  </div>
                </div>
              </div>
            </div>

            <div
              className={classes.infoSec}
              style={{
                backgroundColor: '#fff',
                paddingTop: '20px',
              }}
            >
              <div className={classes.infoTitleSec}>
                <span className={classes.infoSecNum}>3</span>
                <Typography
                  component="span"
                  variant="h6"
                  className={classes.infoSecTitle}
                >
                  Your Order
                </Typography>
                {/* <Typography
                  component="span"
                  variant="h6"
                  className={classes.infoSecEdit}
                >
                  Edit
                </Typography> */}
              </div>
              <div className={classes.infoContentSec}>
                <div>{this.renderBags()}</div>
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
                      {currency}
                      {totalPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>

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
                  Style of delievery
                </Typography>
              </div>
              <div className={classes.infoContentSec}>
                <div
                  style={{
                    verticalAlign: 'middle',
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.delieveryBtn}
                    style={{marginRight: '4vw'}}
                  >
                    Now
                  </Button>
                  <Button variant="contained" className={classes.delieveryBtn}>
                    Pickup
                  </Button>
                  <Button variant="contained" className={classes.delieveryBtn}>
                    Later
                  </Button>
                </div>
              </div>
            </div>

            <div className={classes.checkoutBtnSec}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                fullWidth
                className={classes.roundBtn}
                onClick={()=>{window.location='/checkout/checkoutresult'}}
              >
                Confirm
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="primary"
                fullWidth
                className={classes.roundBtnOutlined}
                onClick={()=>{window.history.back()}}
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

const maptStateToProps = (state) => {
  return {
    isProcessing: getBagProcessing(state),
    errorMessage: getBagError(state),
    bags: getBagBags(state),
    me: getCurrentUser(state),
  };
};

export default compose(
  connect(maptStateToProps, { getBags, deleteBag }),
  withStyles(styles)
)(CheckOutInfo);
