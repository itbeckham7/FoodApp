import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getBags, deleteBag, addToBag } from '../../store/actions';
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
    borderRadius: '5px',
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
    marginTop: '2px',
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
  cartSec: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
    '&:hover,&:focus': {
      backgroundColor: '#E5293E',
    },
  },
});

class Bag extends React.Component {
  state = {
    bags: null,
  };

  componentWillMount() {
    this.props.getBags(this.props.me.id).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        return;
      }

      this.setState({
        bags: this.props.bags,
      });
    });
  }

  onDeleteBag(bag) {
    const { me } = this.props;

    this.props.deleteBag(me.id, bag.foodId).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        return;
      }

      this.setState({
        bags: this.props.bags,
      });
    });
  }

  onPlusQty(bag) {
    const { me } = this.props;

    if (bag.qty > bag.food.qty) return;
    bag.qty++;

    var price = bag.food.trans[0].price;
    var currency = bag.food.trans[0].languageId.currency;

    this.props
      .addToBag(me.id, bag.foodId, price, currency, bag.qty)
      .then(() => {
        if (this.props.errorMessage) {
          console.log('-- error : ', this.props.errorMessage);
          return;
        }

        this.setState({
          bags: this.props.bags,
        });
      });
  }

  onMinusQty(bag) {
    const { me } = this.props;

    if (bag.qty === 0) return;
    bag.qty--;

    var price = bag.food.trans[0].price;
    var currency = bag.food.trans[0].languageId.currency;

    this.props
      .addToBag(me.id, bag.foodId, price, currency, bag.qty)
      .then(() => {
        if (this.props.errorMessage) {
          console.log('-- error : ', this.props.errorMessage);
          return;
        }

        this.setState({
          bags: this.props.bags,
        });
      });
  }

  renderBags() {
    const { classes } = this.props;
    const { bags } = this.state;

    var bagElems = [];
    if (bags && bags.length > 0) {
      bags.map((bag) => {
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
            <div
              style={{
                display: 'inline-block',
                width: 'calc( 100% - 21vw )',
                paddingLeft: '12px',
              }}
            >
              <div className={classes.bagElemTitleSec}>
                <span className={classes.bagElemTitleSpan}>
                  {textEllipsis(bag.food.trans[0].title, 40, '...')} &times;{' '}
                  {bag.qty}
                </span>
              </div>
              <Typography
                component="p"
                variant="h6"
                className={classes.bagElemNote}
              >
                Notes: {bag.note ? bag.note : ''}
              </Typography>

              <div className={classes.cartSec}>
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
                <Typography
                  component="p"
                  variant="h6"
                  className={classes.bagElemPrice}
                >
                  {bag.food ? bag.currency + bag.price * bag.qty : ''}
                </Typography>
              </div>

              <IconButton
                aria-label="delete"
                className={classes.bagDeleteBtn}
                onClick={this.onDeleteBag.bind(this, bag)}
              >
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
    const { classes } = this.props;
    const { bags } = this.state;

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

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div className={classes.topSec}>
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
          <div className={classes.mainSec}>
            <div className={classes.bagListSec}>
              <div>{this.renderBags()}</div>
              <div style={{ padding: '12px' }}>
                <div
                  style={{
                    borderTop: '3px dashed #ddd',
                    justifyContent: 'space-between',
                    display: 'flex',
                    padding: '12px 12px 50px',
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
            {itemCounts ? (
              <div style={{ margin: '30px 0' }}>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  fullWidth
                  className={classes.roundBtn}
                  onClick={() => {
                    this.props.history.push('/checkout/checkoutinfo');
                  }}
                >
                  Check out
                </Button>
              </div>
            ) : (
              <div></div>
            )}
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
  connect(mapStateToProps, { getBags, addToBag, deleteBag }),
  withStyles(styles)
)(Bag);
