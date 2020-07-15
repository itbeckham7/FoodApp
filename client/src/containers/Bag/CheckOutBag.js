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
    backgroundColor: '#0B2031',
    width: '100%',
    position: 'relative',
  },
  totalPriceSec: {
    width: '100%',
    padding: theme.spacing(0, 2),
    position: 'absolute',
    bottom: '-5px',
  },
  mainSec: {
    flex: 2.8,
    width: '100%',
    overflowY: 'auto',
    padding: theme.spacing(0, 2, 2, 2),
    backgroundColor: '#fff',
  },
  whiteTitle: {
    color: '#fff',
    fontWeight: '300',
    padding: theme.spacing(0, 3),
    fontSize: '1rem',
    textAlign: 'center',
  },
  blackTitle: {
    color: '#000',
    fontWeight: '300',
    fontSize: '1.2rem',
    padding: theme.spacing(0, 0, 2),
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
    padding: theme.spacing(2),
    verticalAlign: 'top',
    position: 'relative',
  },
  bagElemImageSec: {
    display: 'inline-block',
    width: '20vw',
    height: '20vw',
  },
  bagElemImage: {
    width: '100%',
    height: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'auto 100%',
    backgroundRepeat: 'no-repeat',
  },
  bagElemTitleSec: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing(1, 0, 0.5),
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

  roundBtn: {
    borderRadius: '50px',
    marginTop: '10px',
    backgroundColor: '#E5293E',
    '&:hover,&:focus': {
      backgroundColor: '#E5293E',
    },
  },
});

class CheckOutBag extends React.Component {
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

  onDeleteBag(bag){
    console.log('-- onDeleteBag bag : ', bag)
    const {me} = this.props;

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
            <div
              style={{
                display: 'inline-block',
                width: 'calc( 100% - 21vw )',
                paddingLeft: '12px',
              }}
            >
              <div className={classes.bagElemTitleSec}>
                <span className={classes.bagElemTitleSpan}>
                  {textEllipsis(bag.food.trans[0].title, 40, '...')}{' '}
                  &times; {bag.qty}
                </span>
              </div>
              <Typography
                component="p"
                variant="h6"
                className={classes.bagElemNote}
              >
                Notes: {bag.note ? bag.note : ''}
              </Typography>

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
              <IconButton aria-label="delete" className={classes.bagDeleteBtn} onClick={this.onDeleteBag.bind(this, bag)}>
                <CloseIcon fontSize="small" />
              </IconButton>
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

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div container className={classes.topSec}>
            <div className={classes.totalPriceSec}>
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#E5293E',
                  borderRadius: '7px',
                  padding: '15px 0',
                }}
              >
                <Typography
                  component="p"
                  variant="h6"
                  className={classes.whiteTitle}
                >
                  {itemCounts} Items / Total Cost {currency}
                  {totalPrice}
                </Typography>
              </div>
            </div>
          </div>
          <div container className={classes.mainSec}>
            <div className={classes.bagListSec}>
              <div>{this.renderBags()}</div>
              <div style={{ padding: '12px' }}>
                <div style={{ borderTop: '3px dashed #ddd', justifyContent: 'space-between', display: 'flex', padding: '12px 12px 50px'}}>
                  <span className={classes.totalPriceText1}>TOTAL</span>
                  <span className={classes.totalPriceText2}>{currency}{totalPrice}</span>
                </div>
              </div>
            </div>

            <div style={{ margin: '30px 0' }}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                fullWidth
                className={classes.roundBtn}
                onClick={()=>{window.location='/checkout/checkoutinfo'}}
              >
                Check out
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
)(CheckOutBag);
