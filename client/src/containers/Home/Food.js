import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Rating from '@material-ui/lab/Rating';
import Tab from '@material-ui/core/Tab';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import TabContext from '@material-ui/lab/TabContext';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getFood,
  addToBag,
  getComments,
  addComment,
  getBags,
  clearBag,
} from '../../store/actions';
import AddIcon from '@material-ui/icons/Add';
import {
  getFoodFood,
  getFoodProcessing,
  getFoodError,
  getCurrentUser,
  getBagBags,
  getBagProcessing,
  getBagError,
  getCommentComments,
  getLangLang,
} from '../../store/selectors';
import { required } from '../../utils/formValidator';
import { getTrans, getExtraPrice } from '../../utils';
import config from '../../config';
import * as translation from '../../trans';

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
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    textAlign: 'center',
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
    borderRadius: '20px',
    backgroundColor: '#E5293E',
    fontSize: '0.8rem',
    marginTop: '5px',
  },
  foodOldPrice: {
    display: 'inline-block',
    color: '#fff',
    fontWeight: '300',
    textAlign: 'right',
    fontSize: '0.8rem',
    padding: theme.spacing(0, 1.5),
    marginTop: '5px',
    textDecoration: 'line-through',
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
    textAlign: 'center',
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
    flex: 'auto',
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
    color: '#666',
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
    padding: theme.spacing(0, 0, 0),
    fontWeight: '300',
    fontSize: '0.8rem',
    lineHeight: '1rem',
    textAlign: 'left',
    marginTop: '0',
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Food extends React.Component {
  
  constructor(props) {
    super();

    var lang = props.lang ? props.lang.abbr.toLowerCase() : 'en';
    this.state = {
      tabValue: 'book',
      qty: 1,
      note: '',
      rating: 0,
      isVisibleAddCommentDlg: false,
      comments: [],
      bag: null,
      bagExtras: [],
      _t: translation[lang],
      direction: lang === 'ar' ? 'rtl' : 'ltr'
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.onPlusQty = this.onPlusQty.bind(this);
    this.onMinusQty = this.onMinusQty.bind(this);
    this.onAddToBag = this.onAddToBag.bind(this);
    this.onNoteChange = this.onNoteChange.bind(this);
    this.openAddCommentDlg = this.openAddCommentDlg.bind(this);
    this.closeAddCommentDlg = this.closeAddCommentDlg.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCheckOut = this.onCheckOut.bind(this);
  }

  componentWillMount() {
    if (this.props.match.params && this.props.match.params.foodId) {
      this.props.getFood(this.props.match.params.foodId).then(() => {
        if (this.props.errorMessage) {
          console.log('-- error : ', this.props.errorMessage);
          return;
        }

      });

      this.props.getBags(this.props.me.id).then(() => {
        if (this.props.errorMessage) {
          console.log('-- error : ', this.props.errorMessage);
          return;
        }

        var bags = this.props.bags;
        if (bags) {
          for (var i = 0; i < bags.length; i++) {
            if (bags[i].foodId === this.props.match.params.foodId) {
              this.setState({
                qty: bags[i].qty,
                bag: bags[i],
                bagExtras: bags[i].bagExtras,
              });
            }
          }
        }
      });

      this.props.getComments(this.props.match.params.foodId).then(() => {
        if (this.props.errorMessage) {
          console.log('-- error : ', this.props.errorMessage);
          return;
        }

        var comments = this.props.comments;
        if (comments) {
          this.setState({ comments });
        }
      });
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { lang } = this.props;

    if (
      (!lang && nextProps.lang) ||
      (lang && nextProps.lang && lang.abbr !== nextProps.lang.abbr)
    ) {
      this.setState({
        _t: translation[nextProps.lang.abbr.toLowerCase()],
        direction: nextProps.lang.abbr === 'AR' ? 'rtl' : 'ltr'
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
    var { qty } = this.state;

    if (qty === 0) return;
    qty--;
    this.setState({
      qty: qty,
    });
  }

  onNoteChange(event) {
    this.setState({ note: event.target.value });
  }

  onAddToBag() {
    const { food, me } = this.props;
    const { qty, note, bagExtras } = this.state;

    var lang = this.props.lang ? this.props.lang.abbr : 'EN';
    var trans = getTrans(food, lang);
    var price = trans ? trans.price : 0;
    var currency = trans ? trans.languageId.currency : '';

    this.props
      .addToBag(me.id, food._id, price, currency, qty, note, bagExtras)
      .then(() => {
        if (this.props.errorMessage) {
          throw new SubmissionError({ _error: this.props.errorMessage });
        }
      });
  }

  onCheckOut() {
    this.props.clearBag();

    var lang = this.props.lang ? this.props.lang.abbr : 'EN';
    var trans = getTrans(this.props.food, lang);
    var price = trans ? trans.price : 0;
    var currency = trans ? trans.languageId.currency : '';

    var that = this;
    setTimeout(function () {
      that.props
        .addToBag(
          that.props.me.id,
          that.props.food._id,
          price,
          currency,
          that.state.qty,
          that.state.note
        )
        .then(() => {
          if (that.props.errorMessage) {
            console.log('-- error : ', that.props.errorMessage);
            return;
          }
          that.props.history.push('/bag/checkout');
        });
    }, 100);
  }

  addExtra(Name, Value, Price, event) {
    var { bagExtras } = this.state;

    var addExtra = Name + '-' + Value + '-' + Price;

    var isExist = false;
    for (var i = 0; i < bagExtras.length; i++) {
      var extra = bagExtras[i];
      if (extra === addExtra) {
        bagExtras.splice(i, 1);
        isExist = true;
        break;
      }
    }

    if (!isExist) {
      bagExtras.push(addExtra);
    }

    this.setState({ bagExtras: bagExtras });
  }

  renderExtras() {
    const { food, classes } = this.props;
    const { qty, bagExtras, _t, direction } = this.state;
    var lang = this.props.lang ? this.props.lang.abbr : 'EN';
    var trans = getTrans(food, lang);

    var extras = [];
    var newExtras = [];
    var extrasElem = [];
    if (food && trans && trans.extras) extras = JSON.parse(trans.extras);

    extras.map((extra) => {
      if (!newExtras[extra.Name]) {
        newExtras[extra.Name] = [];
      }
      newExtras[extra.Name].push({
        Value: extra.Value,
        Price: extra['Extra Price'],
      });

      return extra
    });

    if (extras.length > 0) {
      var extraNames = Object.keys(newExtras);

      extraNames.map((Name) => {
        var extraValues = newExtras[Name];
        var extraValuesElem = [];
        extraValues.map((extraValue) => {
          var isExist = bagExtras.filter((extra) => {
            return (
              extra === Name + '-' + extraValue.Value + '-' + extraValue.Price
            );
          }).length;

          extraValuesElem.push(
            <FormGroup row key={extraValue.Value}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isExist > 0}
                    onChange={this.addExtra.bind(
                      this,
                      Name,
                      extraValue.Value,
                      extraValue.Price
                    )}
                    color="primary"
                  />
                }
                label={
                  <div
                    style={{
                      marign: 0,
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '75vw',
                    }}
                  >
                    <span
                      className={classes.inputLabel}
                      style={{ display: 'inline-block' }}
                    >
                      {extraValue.Value}
                    </span>
                    <span
                      className={classes.inputLabelMargin}
                      style={{ display: 'inline-block' }}
                    ></span>
                    <span
                      className={classes.inputLabel}
                      style={{ display: 'inline-block' }}
                    >
                      +{extraValue.Price}
                    </span>
                  </div>
                }
                style={{ width: '100%' }}
              />
            </FormGroup>
          );

          return extraValue
        });

        extrasElem.push(
          <div key={'extras-' + Name}>
            <Typography
              component="h1"
              variant="h6"
              className={classes.foodBookTitle}
              style={{textAlign: direction === 'rtl' ? 'right' : 'left'}}
            >
              {Name}
            </Typography>
            <div style={{ marginBottom: '20px' }}>{extraValuesElem}</div>
          </div>
        );

        return Name
      });
    }

    var price = trans ? trans.price : 0;
    if (bagExtras) price += getExtraPrice(bagExtras);

    return (
      <div style={{ padding: '16px 16px' }}>
        {extrasElem}

        <Typography
          component="p"
          variant="h6"
          className={classes.foodBookTitle}
          style={{textAlign: direction === 'rtl' ? 'right' : 'left'}}
        >
          {_t.food.quantity}
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
            {trans ? trans.languageId.currency + price * qty : ''}
          </span>
        </div>

        <Typography
          component="p"
          variant="h6"
          className={classes.foodBookTitle}
          style={{textAlign: direction === 'rtl' ? 'right' : 'left'}}
        >
          {_t.food.other_description}
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

        {this.state.qty > 0 && (
          <div className={classes.actionSec}>
            <Button
              size="large"
              className={classes.roundBtnOutline}
              variant="outlined"
              fullWidth
              onClick={this.onAddToBag}
            >
              {_t.food.add_to_bag}
            </Button>
            <Button
              variant="contained"
              size="large"
              color="primary"
              fullWidth
              className={classes.roundBtn}
              onClick={this.onCheckOut}
            >
              {_t.bag.check_out}
            </Button>
          </div>
        )}
      </div>
    );
  }

  renderDesc() {
    const { food, classes } = this.props;
    const { _t } = this.state;
    var lang = this.props.lang ? this.props.lang.abbr : 'EN';
    var trans = getTrans(food, lang);

    return (
      <div style={{ padding: '16px 16px' }}>
        <Typography
          component="h1"
          variant="h6"
          className={classes.foodDetailTitle}
        >
          {_t.bag.description}
        </Typography>
        <Typography
          component="p"
          variant="h6"
          className={classes.foodDetailDesc}
          dangerouslySetInnerHTML={{ __html: trans ? trans.desc : '' }}
        ></Typography>
      </div>
    );
  }

  renderComment() {
    const { classes, comments } = this.props;

    var commentElems = [];
    if (comments && comments.length > 0) {
      comments.map((comment) => {
        var commentTime = new Date(comment.createdAt);
        commentTime = commentTime.toString();
        commentTime = commentTime.split(' ');
        commentTime =
          commentTime.length > 4 ? commentTime[1] + ' ' + commentTime[2] : '';
        commentElems.push(
          <Grid container className={classes.commentElem}>
            <Grid xs={2} item>
              <Avatar
                src={
                  config.serverUrl + comment.userId[0].provider.local.picture
                }
                alt="Avatar"
                className={classes.avatar}
              />
            </Grid>
            <Grid xs={10} item>
              <Grid container>
                <Grid xs={6} item>
                  <Typography
                    component="p"
                    variant="h6"
                    className={classes.foodCommentSubject}
                  >
                    {comment.subject}
                  </Typography>
                  <Rating
                    name="read-only"
                    value={comment.rating}
                    readOnly
                    size="small"
                    className={classes.foodRating}
                  />
                </Grid>
                <Grid xs={6} item>
                  <Typography
                    component="p"
                    variant="h6"
                    className={classes.foodCommentDate}
                  >
                    {commentTime}
                  </Typography>
                  <Typography
                    component="p"
                    variant="h6"
                    className={classes.foodCommentUser}
                  >
                    {comment.userId[0].username}
                  </Typography>
                </Grid>
              </Grid>

              <Typography
                component="p"
                variant="h6"
                className={classes.foodCommentDesc}
              >
                {comment.description}
              </Typography>
            </Grid>
          </Grid>
        );

        return comment;
      });
    }

    return (
      <div>
        {commentElems}
        {this.props.me.role !== 'guest' && (
          <Fab
            color="primary"
            aria-label="add"
            className={classes.foodCommentAdd}
            onClick={this.openAddCommentDlg}
          >
            <AddIcon />
          </Fab>
        )}
        {this.props.me.role !== 'guest' && this.renderAddCommentModal()}
      </div>
    );
  }

  openAddCommentDlg() {
    this.setState({ isVisibleAddCommentDlg: true });
  }

  closeAddCommentDlg() {
    this.setState({ isVisibleAddCommentDlg: false });
  }

  renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
    <TextField
      label={label}
      error={touched && !!error}
      helperText={touched && error}
      variant="outlined"
      margin="none"
      required
      fullWidth
      {...input}
      {...custom}
    />
  );

  onSubmit = (formValues) => {
    const { me, food } = this.props;
    const { rating } = this.state;

    formValues.rating = rating;
    return this.props.addComment(me.id, food._id, formValues).then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
      }

      var comments = this.props.comments;
      this.setState({ isVisibleAddCommentDlg: false, comments: comments });
    });
  };

  renderAddCommentModal() {
    const { handleSubmit, classes } = this.props;
    const { isVisibleAddCommentDlg, _t } = this.state;
    return (
      <Dialog
        open={isVisibleAddCommentDlg}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.closeAddCommentDlg}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          id="alert-dialog-slide-title"
          style={{ textAlign: 'center', fontSize: '1.5rem' }}
        >
          {_t.food.comment_now}
        </DialogTitle>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="subject"
                  label={_t.food.subject}
                  name="subject"
                  autoComplete="subject"
                  component={this.renderTextField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  name="description"
                  label={_t.food.description}
                  id="description"
                  autoComplete="description"
                  component={this.renderTextField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <span
                  style={{
                    verticalAlign: 'middle',
                    display: 'inline-block',
                    marginRight: '20px',
                  }}
                >
                  {_t.food.rating}:{' '}
                </span>
                <Rating
                  name="rating"
                  size="large"
                  value={this.state.rating}
                  onChange={(event, newValue) => {
                    this.setState({ rating: newValue });
                  }}
                  style={{ verticalAlign: 'middle' }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeAddCommentDlg} variant="outlined">
              {_t.food.cancel}
            </Button>
            <Button color="primary" variant="contained" type="submit">
              {_t.food.submit}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }

  render() {
    const { classes, food } = this.props;
    const { tabValue, comments, _t } = this.state;
    var lang = this.props.lang ? this.props.lang.abbr : 'EN';
    var trans = getTrans(food, lang);

    var totalRating = 0;
    if (comments && comments.length > 0) {
      comments.map((comment) => {
        totalRating += comment.rating;
        return comment;
      });
      totalRating = parseFloat(totalRating / comments.length).toFixed(1);
    }

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div
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
                <span className={classes.foodPrice}>
                  {trans ? trans.languageId.currency + trans.price : ''}
                </span>
              </Typography>
              <Typography
                component="p"
                variant="h6"
                className={classes.whiteTitle}
                style={{ bottom: '20px' }}
              >
                <span className={classes.foodOldPrice}>
                  {trans ? trans.languageId.currency + trans.oldPrice : ''}
                </span>
              </Typography>
            </div>
          </div>
          <div className={classes.mainSec}>
            <div>
              <Typography
                component="h1"
                variant="h6"
                className={classes.foodDetailTitle}
              >
                {trans ? trans.title : ''}
              </Typography>
              <Typography
                component="p"
                variant="h6"
                className={classes.foodDetailDesc}
                dangerouslySetInnerHTML={{ __html: trans ? trans.desc : '' }}
              ></Typography>
              <div className={classes.foodRatingSec}>
                <Rating
                  name="read-only"
                  value={totalRating}
                  precision={0.1}
                  readOnly
                  className={classes.foodRating}
                />
                <Typography component="span" className={classes.foodRatingText}>
                  {totalRating}
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
                  <Tab
                    label={_t.food.book}
                    value="book"
                    className={classes.tabText}
                  />
                  <Tab
                    label={_t.food.description}
                    value="description"
                    className={classes.tabText}
                  />
                  <Tab
                    label={_t.food.comment}
                    value="comment"
                    className={classes.tabText}
                  />
                </TabList>
              </div>
              <TabPanel value={'book'}>{this.renderExtras()}</TabPanel>
              <TabPanel value={'description'}>{this.renderDesc()}</TabPanel>
              <TabPanel value={'comment'}>{this.renderComment()}</TabPanel>
            </TabContext>
          </div>
        </div>
      </div>
    );
  }
}

const validate = (values) => {
  const errors = {};
  errors.subject = required(values.subject);
  errors.description = required(values.description);
  return errors;
};

const mapStateToProps = (state) => {
  return {
    isProcessing: getFoodProcessing(state),
    errorMessage: getFoodError(state),
    food: getFoodFood(state),
    bags: getBagBags(state),
    isProcessingBag: getBagProcessing(state),
    errorMessageBag: getBagError(state),
    comments: getCommentComments(state),
    me: getCurrentUser(state),
    lang: getLangLang(state),
  };
};

export default compose(
  connect(mapStateToProps, {
    getFood,
    getBags,
    addToBag,
    getComments,
    addComment,
    clearBag,
  }),
  reduxForm({ form: 'addComment', validate }),
  withStyles(styles)
)(Food);
