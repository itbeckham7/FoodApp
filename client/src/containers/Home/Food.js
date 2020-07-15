import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Rating from '@material-ui/lab/Rating';
import Tabs from '@material-ui/core/Tab';
import Tab from '@material-ui/core/Tab';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import TabContext from '@material-ui/lab/TabContext';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFood, addToBag } from '../../store/actions';
import AddIcon from '@material-ui/icons/Add';
import {
  getFoodFood,
  getFoodProcessing,
  getFoodError,
  getCurrentUser,
  getBagBags,
} from '../../store/selectors';
import { textEllipsis } from '../../utils/textUtils';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import config from '../../config';

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
    backgroundImage: 'url(../../images/home-food-top.png)',
    backgroundPosition: 'center center',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
  },
  topSecInner: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: '100%',
    height: '100%',
  },
  mainSec: {
    flex: 2.7,
    overflowY: 'auto',
    padding: theme.spacing(0, 2, 3),
    width: '100%',
    zIndex: '100',
    backgroundColor: '#fff',
  },
  whiteTitle: {
    color: '#fff',
    fontWeight: 'normal',
    padding: theme.spacing(0, 3),
    fontSize: '1.3rem',
    lineHeight: '1.5rem',
    position: 'absolute',
    left: '0',
    bottom: '40px',
    width: '100%',
    display: 'block',
    textAlign: 'right',
  },
  blackTitle: {
    color: '#000',
    fontWeight: '300',
    fontSize: '1.2rem',
    padding: theme.spacing(0, 0, 2),
  },
  foodElem: {
    boxShadow: '0 0 10px 3px rgba(0,0,0,0.2)',
    width: '100%',
    borderRadius: '7px',
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  foodImage: {
    display: 'inline-block',
    textAlign: 'center',
    width: '110px',
    height: '110px',
    borderRadius: '200px',
    backgroundPosition: 'center center',
    backgroundSize: 'auto 100%',
    backgroundRepeat: 'no-repeat',
  },
  foodTitle: {
    color: '#000',
    fontWeight: '300',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    padding: theme.spacing(1, 0),
  },
  foodDesc: {
    color: '#000',
    fontWeight: '300',
    textOverflow: 'ellipsis',
    fontSize: '0.7rem',
  },
  foodPrice: {
    display: 'inline-block',
    color: '#fff',
    fontWeight: '300',
    textAlign: 'right',
    padding: theme.spacing(0.3, 1.5),
    marginLeft: theme.spacing(1.5),
    borderRadius: '20px',
    backgroundColor: '#E5293E',
    fontSize: '0.8rem',
    marginTop: '5px',
  },
  foodRatingSec: {
    textAlign: 'center',
    padding: theme.spacing(1, 0),
  },
  foodRating: {
    verticalAlign: 'text-top',
  },
  foodRatingText: {
    display: 'inline-block',
    color: '#ffb400',
    fontWeight: '300',
    fontSize: '0.8rem',
    padding: theme.spacing(0, 1),
    verticalAlign: 'text-top',
  },
  tabText: {
    fontWeight: '300',
    fontSize: '0.7rem',
  },
  foodDetailTitle: {
    padding: theme.spacing(4, 0, 1),
    fontWeight: 'normal',
    fontSize: '1.1rem',
    textAlign: 'center',
  },
  foodDetailDesc: {
    padding: theme.spacing(0, 0),
    fontWeight: '300',
    fontSize: '0.85rem',
    textAlign: 'left',
  },
  foodDetailPrice: {
    padding: theme.spacing(0, 0),
    fontWeight: '300',
    fontSize: '1rem',
    textAlign: 'right',
  },
  foodBookTitle: {
    padding: theme.spacing(1, 0),
    fontWeight: 'normal',
    fontSize: '1.1rem',
    textAlign: 'left',
  },
  inputLabel: {
    fontSize: '0.75rem',
    fontWeight: '300',
  },
  inputLabelMargin: {
    display: 'inline-block',
    width: '150px',
    height: '10px',
    borderBottom: '1px solid rgba(0,0,0,0.2)',
    margin: theme.spacing(0, 1),
  },
  quentityBtn: {
    fontSize: '1.5rem',
    lineHeight: '1rem',
    padding: theme.spacing(0.5, 0.5),
    verticalAlign: 'middle',
  },
  qtyActionSec: {
    marginBottom: '20px',
    border: '1px solid #eaeaea',
    borderRadius: '5px',
    padding: '5px 10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalPriceSec: {
    borderBottom: '1px solid #eaeaea',
    textAlign: 'right',
    marginBottom: '20px',
  },
  totalPriceText: {
    marginLeft: '10px',
    display: 'inline-block',
    fontSize: '1rem',
    color: '#666'
  },
  actionSec: {
    marginTop: '40px',
  },
  roundBtn: {
    borderRadius: '50px',
    marginTop: '10px',
    backgroundColor: '#E5293E',
  },
  roundBtnOutline: {
    borderRadius: '50px',
    marginTop: '10px',
    borderColor: '#E5293E',
    color: '#E5293E',
  },
  commentElem: {
    flexDirection: 'row',
    borderRadius: '10px',
    boxShadow: '0 0 10px 3px rgba(0,0,0,0.1)',
    marginTop: '10px',
    padding: theme.spacing(2),
  },
  foodCommentSubject: {
    padding: theme.spacing(0, 0),
    fontWeight: '300',
    fontSize: '0.8rem',
    lineHeight: '0.8rem',
    textAlign: 'left',
  },
  foodCommentDesc: {
    padding: theme.spacing(0.25, 0, 0),
    fontWeight: '300',
    fontSize: '0.8rem',
    lineHeight: '1rem',
    textAlign: 'left',
    marginTop: '5px',
  },
  foodCommentDate: {
    margin: '0',
    fontSize: '0.8rem',
    lineHeight: '0.9rem',
    color: '#aaa',
    fontWeight: '300',
    textAlign: 'right',
  },
  foodCommentUser: {
    margin: '0',
    fontSize: '0.75rem',
    lineHeight: '0.75rem',
    color: '#aaa',
    fontWeight: '300',
    textAlign: 'right',
  },
  foodCommentAdd: {
    position: 'absolute',
    right: '20px',
    bottom: '70px',
    backgroundColor: '#E5293E',
    '&:hover': {
      backgroundColor: '#E5293E',
    },
  },
  foodCommentAddHover: {
    position: 'absolute',
    right: '20px',
    bottom: '70px',
  },
});

class Food extends React.Component {
  state = {
    tabValue: 'book',
    qty: 0,
    note: ''
  };

  constructor() {
    super();
    this.onTabChange = this.onTabChange.bind(this);
    this.onPlusQty = this.onPlusQty.bind(this);
    this.onMinusQty = this.onMinusQty.bind(this);
    this.onAddToBag = this.onAddToBag.bind(this);
    this.onNoteChange = this.onNoteChange.bind(this);
  }

  componentWillMount() {
    console.log('-- params : ', this.props.match.params);
    if (this.props.match.params && this.props.match.params.foodId) {
      this.props.getFood(this.props.match.params.foodId).then(() => {
        if (this.props.errorMessage) {
          console.log('-- error : ', this.props.errorMessage);
          return;
        }

        var bags = this.props.bags;
        var food = this.props.food;
        console.log('-- bags & food : ', bags, food);

        for (var i = 0; i < bags.length; i++) {
          if (bags[i].foodId == food._id) {
            this.setState({ qty: bags[i].qty });
          }
        }
      });
    }
  }

  onTabChange(event, newValue) {
    this.setState({ tabValue: newValue });
  }

  onPlusQty() {
    const { food } = this.props;
    var { qty } = this.state;

    if (qty > food.qty) return;
    qty++;
    this.setState({
      qty: qty,
    });
  }

  onMinusQty() {
    const { food } = this.props;
    var { qty } = this.state;

    if (qty == 0) return;
    qty--;
    this.setState({
      qty: qty,
    });
  }

  onNoteChange(event) {
    this.setState({note: event.target.value});
  };

  onAddToBag() {
    console.log('-- onAddToBag : start');
    const { food, me, bags } = this.props;
    const { qty, note } = this.state;

    this.props.addToBag(me._id, food._id, qty, note).then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
      }

      console.log('-- bags : ', this.props.bags);
    });
  }

  onCheckOut() {}

  renderBook() {
    const { food, classes } = this.props;
    const { qty } = this.state;

    return (
      <div style={{ padding: '16px 16px' }}>
        <Typography
          component="h1"
          variant="h6"
          className={classes.foodBookTitle}
        >
          Size
        </Typography>
        <div style={{ marginBottom: '20px' }}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={true}
                  onChange={() => {}}
                  name="sizeM"
                  color="primary"
                />
              }
              label={
                <div style={{ marign: 0 }}>
                  <span className={classes.inputLabel}>Size M</span>
                  <span className={classes.inputLabelMargin}></span>
                  <span className={classes.inputLabel}>+0.250</span>
                </div>
              }
            />
          </FormGroup>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={true}
                  onChange={() => {}}
                  name="sizeL"
                  color="primary"
                />
              }
              label={
                <div style={{ marign: 0 }}>
                  <span className={classes.inputLabel}>Size L</span>
                  <span className={classes.inputLabelMargin}></span>
                  <span className={classes.inputLabel}>+0.500</span>
                </div>
              }
            />
          </FormGroup>
        </div>

        <Typography
          component="p"
          variant="h6"
          className={classes.foodBookTitle}
        >
          Style of Packet
        </Typography>
        <div style={{ marginBottom: '20px' }}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={true}
                  onChange={() => {}}
                  name="thin"
                  color="primary"
                />
              }
              label={
                <div style={{ marign: 0 }}>
                  <span className={classes.inputLabel}>Thin</span>
                  <span className={classes.inputLabelMargin}></span>
                  <span className={classes.inputLabel}>+0.000</span>
                </div>
              }
            />
          </FormGroup>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={true}
                  onChange={() => {}}
                  name="thick"
                  color="primary"
                />
              }
              label={
                <div style={{ marign: 0 }}>
                  <span className={classes.inputLabel}>Thick</span>
                  <span className={classes.inputLabelMargin}></span>
                  <span className={classes.inputLabel}>+0.000</span>
                </div>
              }
            />
          </FormGroup>
        </div>

        <Typography
          component="p"
          variant="h6"
          className={classes.foodBookTitle}
        >
          Quantity
        </Typography>
        <div className={classes.qtyActionSec}>
          <span className={classes.quentityBtn} onClick={this.onPlusQty}>
            +
          </span>
          <span>{qty}</span>
          <span className={classes.quentityBtn} onClick={this.onMinusQty}>
            -
          </span>
        </div>

        <div className={classes.totalPriceSec}>
          <span className={classes.totalPriceText}>Total</span>
          <span className={classes.totalPriceText}>
            {food
              ? food.trans[0].languageId.currency + (food.trans[0].price * qty)
              : ''}
          </span>
        </div>

        <Typography
          component="p"
          variant="h6"
          className={classes.foodBookTitle}
        >
          Other Description
        </Typography>
        <div>
          <TextField
            multiline={true}
            rows={4}
            fullWidth
            variant="outlined"
            style={{ height: '100px' }}
            onChange={this.onNoteChange}
          />
        </div>

        <div className={classes.actionSec}>
          <Button
            size="large"
            className={classes.roundBtnOutline}
            variant="outlined"
            fullWidth
            onClick={this.onAddToBag}
          >
            Add to bag
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            fullWidth
            className={classes.roundBtn}
            onClick={()=>{
              window.location = '/bag/checkout';
            }}
          >
            Check out
          </Button>
        </div>
      </div>
    );
  }

  renderDesc() {
    const { food, classes } = this.props;

    return (
      <div style={{ padding: '16px 16px' }}>
        <Typography
          component="h1"
          variant="h6"
          className={classes.foodDetailTitle}
        >
          Description
        </Typography>
        <Typography
          component="p"
          variant="h6"
          className={classes.foodDetailDesc}
        >
          {food ? food.trans[0].desc : ''}
        </Typography>
      </div>
    );
  }

  renderComment() {
    const { food, classes } = this.props;

    return (
      <div>
        <Grid container className={classes.commentElem}>
          <Grid xs={2}>
            <Avatar
              src={config.serverUrl + '/assets/images/dashboard/man.jpg'}
              alt="My Avatar"
              className={classes.avatar}
            />
          </Grid>
          <Grid xs={10}>
            <Grid container>
              <Grid xs={6}>
                <Typography
                  component="p"
                  variant="h6"
                  className={classes.foodCommentSubject}
                >
                  Nice
                </Typography>
                <Rating
                  name="read-only"
                  value={4}
                  readOnly
                  size="small"
                  className={classes.foodRating}
                />
              </Grid>
              <Grid xs={6}>
                <Typography
                  component="p"
                  variant="h6"
                  className={classes.foodCommentDate}
                >
                  23 Mar
                </Typography>
                <Typography
                  component="p"
                  variant="h6"
                  className={classes.foodCommentUser}
                >
                  jenis
                </Typography>
              </Grid>
            </Grid>

            <Typography
              component="p"
              variant="h6"
              className={classes.foodCommentDesc}
            >
              layer fragrance products for lasting scent - e.g lotion and then
              spray perfume.
            </Typography>
          </Grid>
        </Grid>
        <Grid container className={classes.commentElem}>
          <Grid xs={2}>
            <Avatar
              src={config.serverUrl + '/assets/images/dashboard/man.jpg'}
              alt="My Avatar"
              className={classes.avatar}
            />
          </Grid>
          <Grid xs={10}>
            <Grid container>
              <Grid xs={6}>
                <Typography
                  component="p"
                  variant="h6"
                  className={classes.foodCommentSubject}
                >
                  Nice
                </Typography>
                <Rating
                  name="read-only"
                  value={4}
                  readOnly
                  size="small"
                  className={classes.foodRating}
                />
              </Grid>
              <Grid xs={6}>
                <Typography
                  component="p"
                  variant="h6"
                  className={classes.foodCommentDate}
                >
                  23 Mar
                </Typography>
                <Typography
                  component="p"
                  variant="h6"
                  className={classes.foodCommentUser}
                >
                  jenis
                </Typography>
              </Grid>
            </Grid>

            <Typography
              component="p"
              variant="h6"
              className={classes.foodCommentDesc}
            >
              layer fragrance products for lasting scent - e.g lotion and then
              spray perfume.
            </Typography>
          </Grid>
        </Grid>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.foodCommentAdd}
        >
          <AddIcon />
        </Fab>
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
      food,
    } = this.props;

    const { tabValue } = this.state;

    console.log('-- food : ', food);

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div
            container
            className={classes.topSec}
            style={{
              backgroundImage: food
                ? 'url(' + config.serverUrl + food.image + ')'
                : 'none',
            }}
          >
            <div className={classes.topSecInner}>
              <Typography
                component="p"
                variant="h6"
                className={classes.whiteTitle}
              >
                <span>{food ? food.trans[0].title : ''}</span>
                <span className={classes.foodPrice}>
                  {food
                    ? food.trans[0].languageId.currency + food.trans[0].price
                    : ''}
                </span>
              </Typography>
            </div>
          </div>
          <div container className={classes.mainSec}>
            <div>
              <Typography
                component="h1"
                variant="h6"
                className={classes.foodDetailTitle}
              >
                {food ? food.trans[0].title : ''}
              </Typography>
              <Typography
                component="p"
                variant="h6"
                className={classes.foodDetailDesc}
              >
                {food ? food.trans[0].desc : ''}
              </Typography>
              <div className={classes.foodRatingSec}>
                <Rating
                  name="read-only"
                  value={4}
                  readOnly
                  className={classes.foodRating}
                />
                <Typography component="span" className={classes.foodRatingText}>
                  4
                </Typography>
              </div>
            </div>
            <TabContext value={tabValue}>
              <div style={{ borderBottom: '1px solid #eaeaea' }}>
                <TabList
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  centered
                  onChange={this.onTabChange}
                  aria-label="disabled tabs example"
                >
                  <Tab label="Book" value="book" className={classes.tabText} />
                  <Tab
                    label="Description"
                    value="description"
                    className={classes.tabText}
                  />
                  <Tab
                    label="Comment"
                    value="comment"
                    className={classes.tabText}
                  />
                </TabList>
              </div>
              <TabPanel value={'book'}>{this.renderBook()}</TabPanel>
              <TabPanel value={'description'}>{this.renderDesc()}</TabPanel>
              <TabPanel value={'comment'}>{this.renderComment()}</TabPanel>
            </TabContext>
          </div>
        </div>
      </div>
    );
  }
}

const maptStateToProps = (state) => {
  return {
    isProcessing: getFoodProcessing(state),
    errorMessage: getFoodError(state),
    food: getFoodFood(state),
    bags: getBagBags(state),
    me: getCurrentUser(state),
  };
};

export default compose(
  connect(maptStateToProps, { getFood, addToBag }),
  withStyles(styles)
)(Food);
