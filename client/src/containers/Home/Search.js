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
    color: '#E5293E',
    fontSize: '1.3rem',
    fontWeight: 'normal',
    margin: theme.spacing(1),
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
    borderRadius: '10px',
    boxShadow: '0 0 10px 3px rgba(0,0,0,0.1)',
    marginTop: '10px',
    padding: theme.spacing(1.5),
  },
  bagElemTitleSec: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bagElemTitleSpan: {
    verticalAlign: 'middle',
    width: '70%',
    height: '40px',
    fontSize: '0.85rem',
    lineHeight: '1rem',
  },
  bagElemRatingSpan: {
    verticalAlign: 'middle',
  },
  foodRating: {
    verticalAlign: 'middle',
  },
  foodRatingText: {
    display: 'inline-block',
    color: '#ffb400',
    fontWeight: '300',
    fontSize: '0.8rem',
    padding: theme.spacing(0, 0.5),
    verticalAlign: 'middle',
  },
  foodDetailDesc: {
    padding: theme.spacing(0, 0),
    fontWeight: '300',
    fontSize: '0.75rem',
    lineHeight: '0.9rem',
    textAlign: 'left',
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

class Search extends React.Component {
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

  renderFoods() {
    const { classes } = this.props;
    const { bags } = this.state;
    console.log('-- renderBags bags : ', bags);
    var bagElems = [];
    for( var i=0; i<5; i++){
      bagElems.push(
        <Grid container className={classes.bagElem}>
          <Grid xs={3}>
            <Box
              style={{
                width: '100%',
                height: '100%',
                backgroundImage:
                  'url(' + config.serverUrl + '/uploads/food/foodbakery_special_pizza.jpg' + ')',
                backgroundPosition: 'center',
                backgroundSize: 'auto 100%',
                backgroundRepeat: 'no-repeat',
                height: '100%',
                borderRadius: '5px',
              }}
            ></Box>
          </Grid>
          <Grid xs={9} style={{ paddingLeft: '10px' }}>
            <div className={classes.bagElemTitleSec}>
              <span className={classes.bagElemTitleSpan}>
                {textEllipsis('Foodbakery Special Pizza', 40, '...')}
              </span>
              <span className={classes.bagElemRatingSpan}>
                <Rating
                  name="read-only"
                  max={1}
                  value={1}
                  readOnly
                  size="small"
                  className={classes.foodRating}
                />
                <Typography
                  component="span"
                  className={classes.foodRatingText}
                >
                  4
                </Typography>
              </span>
            </div>
            <Typography
              component="p"
              variant="h6"
              className={classes.foodDetailDesc}
            >
              Cheese, tomatoes, tuna fish, sweetcorn and italian herbs
            </Typography>
          </Grid>
        </Grid>
      );
    }
    
    return (
      <div>
        {bagElems}
      </div>
    );
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
                Search Result
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
                paddingTop: '0',
                paddingBottom: '20px',
                backgroundColor: '#fff',
              }}
            >
              <div className={classes.infoTitleSec}>
                <img src="/images/Product-hunt-amico.png" />
                <Typography
                  component="p"
                  variant="h6"
                  className={classes.resultText}
                >
                  Fount: 7
                </Typography>
              </div>
              <div className={classes.infoContentSec}>
                {this.renderFoods()}
              </div>
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
)(Search);
