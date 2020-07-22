import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import csc from 'country-state-city';
import {
  getBags,
  deleteBag,
  getActiveAddress,
  getActiveCard,
} from '../../store/actions';
import {
  getBagBags,
  getBagProcessing,
  getBagError,
  getCurrentUser,
  getAddressActiveAddress,
  getCardActiveCard,
} from '../../store/selectors';
import { email, minLength, required } from '../../utils/formValidator';
import config from '../../config';

const styles = (theme) => ({
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
});

class Bags extends React.Component {
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
        return;
      }

      this.setState({
        bags: this.props.bags,
      });

      this.props.updateBags(this.props.bags);
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

  render() {
    const { classes } = this.props;
    const { bags } = this.state;

    var totalPrice = 0;
    var currency = '';
    var itemCounts = 0;

    var bagElems = [];
    if (bags && bags.length > 0) {
      itemCounts = bags.length;
      bags.map((bag) => {
        currency = bag.currency;
        totalPrice += bag.price * bag.qty;

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
        </div>
        <div className={classes.infoContentSec}>
          {bagElems}
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
  connect(mapStateToProps, { getBags, deleteBag }),
  withStyles(styles)
)(Bags);
