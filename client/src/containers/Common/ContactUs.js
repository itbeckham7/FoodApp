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
  infoContentSec: {
    marginTop: '15px',
  },
  contactElem: {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: theme.spacing(1),
    marginBottom: '40px'
  },
  contactElemSub: {
    textAlign: 'center',
  },
  contactElemText: {
    display: 'inline-block',
    color: '#0B2031',
    fontSize: '0.75rem',
    fontWeight: 'normal',
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  contactElemImage: {
    display: 'inline-block',
    marginRight: '10px',
    verticalAlign: 'middle'
  },
  roundBtn: {
    borderRadius: '50px',
    backgroundColor: '#E5293E',
    '&:hover,&:focus': {
      backgroundColor: '#E5293E',
    },
  },
});

class AboutUs extends React.Component {
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

  renderContactInfo() {
    const { classes } = this.props;
    const { bags } = this.state;
    console.log('-- renderBags bags : ', bags);
    var contactElems = [];
    for (var i = 0; i < 5; i++) {
      contactElems.push(
        <Grid container className={classes.contactElem}>
          <Grid xs={4} className={classes.contactElemText}>
            <Typography component="span" className={classes.contactElemText}>
              KUWAIT
            </Typography>
          </Grid>
          <Grid xs={4} className={classes.contactElemText} style={{borderLeft: '1px solid #E5293E', borderRight: '1px solid #E5293E'}}>
            <img src="/images/phone-solid.png" className={classes.contactElemImage}/>
            <Typography component="span" className={classes.contactElemText}>
              KUWAIT
            </Typography>
          </Grid>
          <Grid xs={4} className={classes.contactElemText}>
            <img src="/images/map-marker-alt-solid.png" className={classes.contactElemImage}/>
            <Typography component="span" className={classes.contactElemText}>
              KUWAIT
            </Typography>
          </Grid>
        </Grid>
      );
    }

    return <div>{contactElems}</div>;
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
                Contact Us
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
                <img src="/images/Online-world-pana.png" />
              </div>
              <div className={classes.infoContentSec}>
                {this.renderContactInfo()}
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
)(AboutUs);
