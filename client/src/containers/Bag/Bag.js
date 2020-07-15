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
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getBags, addToBag } from '../../store/actions';
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
    backgroundImage: 'url(../../images/home-food-top.png)',
    backgroundPosition: 'bottom center',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    width: '100%',
  },
  mainSec: {
    flex: 1.7,
    width: '100%',
    overflowY: 'auto',
    padding: theme.spacing(3, 3),
    backgroundColor: '#fff'
  },
  whiteTitle: {
    color: '#fff',
    fontWeight: '300',
    padding: theme.spacing(0, 3),
    fontSize: '1.2rem',
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
  // quentityBtn: {
  //   fontSize: '1.5rem',
  //   lineHeight: '1rem',
  //   padding: theme.spacing(0.5, 0.5),
  //   verticalAlign: 'middle',
  // },
  qtyActionSec: {
    marginTop: '5px',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    padding: '3px 10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    fontWeight: '300',
    fontSize: '0.75rem',
    lineHeight: '0.75rem',
  },
  roundBtn: {
    borderRadius: '50px',
    marginTop: '10px',
    backgroundColor: '#E5293E',
  },
});

class Bag extends React.Component {
  state = {
    bags: null,
  };

  constructor() {
    super();
    this.onPlusQty = this.onPlusQty.bind(this);
    this.onMinusQty = this.onMinusQty.bind(this);
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

  onPlusQty(bag) {
    const { me, bags, addToBag } = this.props;

    if (bag.qty > bag.food.qty) return;
    bag.qty++;

    this.props.addToBag(me._id, bag.foodId, bag.qty).then(() => {
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

  onMinusQty(bag) {
    const { me, bags, addToBag } = this.props;

    if (bag.qty == 0) return;
    bag.qty--;

    this.props.addToBag(me._id, bag.foodId, bag.qty).then(() => {
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

  renderBanner() {
    const { classes } = this.props;

    var banners = [
      {
        image: '/assets/images/banner1.png',
      },
      {
        image: '/assets/images/banner2.png',
      },
    ];

    var bannerElems = [];

    if (banners && banners.length > 0) {
      banners.map((banner) => {
        console.log(
          '-- banner image : ',
          'url(' + config.serverUrl + banner.image + ')'
        );
        bannerElems.push(
          <Grid container className={classes.bannerElem}>
            <Grid xs={12}>
              <div
                style={{
                  width: '100%',
                  height: '33vw',
                  backgroundImage:
                    'url(' + config.serverUrl + banner.image + ')',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 100%',
                  borderRadius: '5px',
                }}
              ></div>
            </Grid>
          </Grid>
        );
      });
    }
    return (
      <div>
        {bannerElems}
      </div>
    );
  }
  renderFoods() {
    const { classes } = this.props;
    const { bags } = this.state;
    console.log('-- renderBags bags : ', bags);
    var bagElems = [];
    if (bags && bags.length > 0) {
      bags.map((bag) => {
        bagElems.push(
          <Grid container className={classes.bagElem}>
            <Grid xs={3}>
              <Box
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage:
                    'url(' + config.serverUrl + bag.food.image + ')',
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
                  {textEllipsis(bag.food.trans[0].title, 40, '...')}
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
                {bag.food
                  ? textEllipsis(bag.food.trans[0].desc, 60, '...')
                  : ''}
              </Typography>

              <div className={classes.qtyActionSec}>
                <span
                  className={classes.quentityBtn}
                  onClick={this.onPlusQty.bind(this, bag)}
                >
                  +
                </span>
                <span>{bag.qty}</span>
                <span
                  className={classes.quentityBtn}
                  onClick={this.onMinusQty.bind(this, bag)}
                >
                  -
                </span>
              </div>
            </Grid>
          </Grid>
        );
      });
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

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div container className={classes.topSec}></div>
          <div container className={classes.mainSec}>
            <div>
              <Typography
                component="p"
                variant="h6"
                className={classes.blackTitle}
              >
                ORDER NOW
              </Typography>
            </div>

            <div style={{ marginBottom: '10px' }}>{this.renderBanner()}</div>

            <div>{this.renderFoods()}</div>

            <div style={{margin: '30px 0'}}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                fullWidth
                className={classes.roundBtn}
                onClick={()=>{
                  window.location = '/bag/checkout'
                }}
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
    me: getCurrentUser(state),
    bags: getBagBags(state),
  };
};

export default compose(
  connect(maptStateToProps, { getBags, addToBag }),
  withStyles(styles)
)(Bag);
