import React from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Rating from '@material-ui/lab/Rating';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getCategories,
  getFoods,
  getBags,
  addToBag,
  clearBag,
} from '../../store/actions';
import { ChevronRight, ChevronDown } from 'mdi-material-ui';
import {
  getCategoryCategories,
  getCategoryProcessing,
  getCategoryError,
  getSettingSetting,
  getFoodFoods,
  getFoodProcessing,
  getFoodError,
  getBagBags,
  getBagProcessing,
  getBagError,
  getCurrentUser,
} from '../../store/selectors';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
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
  topSecHome1: {
    flex: 1,
    backgroundImage: 'url(../images/picturemessage_intra0vh.wzc@2x.png)',
    backgroundColor: '#fff',
    backgroundPosition: 'bottom center',
    backgroundSize: '100% auto',
    width: '100%',
  },
  topSecHome2: {
    flex: 1,
    backgroundImage: 'url(../../images/home-food-top.png)',
    backgroundColor: '#fff',
    backgroundPosition: 'bottom center',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    width: '100%',
  },
  mainSecHome1: {
    flex: 1.5,
    overflowY: 'auto',
    padding: theme.spacing(3, 3),
  },
  mainSecHome2: {
    flex: 1.7,
    width: '100%',
    overflowY: 'auto',
    padding: theme.spacing(3, 3),
    backgroundColor: '#fff',
  },
  whiteTitle: {
    color: '#fff',
    fontWeight: '300',
    padding: theme.spacing(0, 3),
    fontSize: '1.2rem',
  },
  blackTitle: {
    color: '#333',
    fontWeight: 'normal',
    fontSize: '1.15rem',
    padding: theme.spacing(1, 0, 3),
    textAlign: 'center'
  },
  categoryImage: {
    borderRadius: '8px',
    width: '100%',
    height: '130px',
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'normal',
    fontSize: '1.2rem',
    position: 'absolute',
    bottom: '0',
    right: '0',
    padding: '5px 20px',
    backgroundColor: 'rgba(229,41,62,0.5)',
    borderTopLeftRadius: '20px',
    borderBottomRightRadius: '5px',
  },
  foodElem: {
    borderRadius: '10px',
    boxShadow: '0 0 10px 3px rgba(0,0,0,0.1)',
    marginTop: '10px',
    padding: theme.spacing(1.5),
  },
  foodElemTitleSec: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodElemTitleSpan: {
    verticalAlign: 'middle',
    width: '70%',
    height: '40px',
    fontSize: '0.85rem',
    lineHeight: '1rem',
  },
  foodElemRatingSpan: {
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
  qtyActionSec: {
    marginTop: '5px',
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    padding: '3px 10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    fontWeight: '300',
    fontSize: '0.75rem',
    lineHeight: '0.75rem',
  },
  checkoutBtn: {
    backgroundColor: '#E5293E',
    width: '20px',
    height: '20px',
    textAlign: 'center',
    borderRadius: '15px',
    marginLeft: '10px',
  },
});

class Home extends React.Component {
  state = {
    categories: null,
    bags: null,
  };

  constructor() {
    super();

    this.renderTopSec = this.renderTopSec.bind(this);
    this.renderTopSecHome1 = this.renderTopSecHome1.bind(this);
    this.renderTopSecHome2 = this.renderTopSecHome2.bind(this);
  }

  componentWillMount() {
    console.log('-- home componentWillMount props : ', this.props);
    this.props.getCategories().then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
      }

      this.setState({ categories: this.props.categories });
    });

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

  async onClickCategory(category) {
    console.log('-- onClickCategory');

    var categories = this.state.categories;
    for (var i = 0; i < categories.length; i++) {
      if (categories[i]._id == category._id) {
        console.log('-- category : ', category);
        if (category.foods) {
          if (category.open) category.open = false;
          else category.open = true;
          categories[i] = category;
          await this.setState({ categories });
          console.log('-- categories : ', i, this.state.categories);
        } else {
          this.props.getFoods(category._id).then(() => {
            if (this.props.errorMessageFoods) {
              console.log('-- error : ', this.props.errorMessageFoods);
              return;
            }

            console.log('-- foods : ', this.props.foods);
            category.foods = this.props.foods;
            category.open = true;
            categories[i] = category;
            this.setState({ categories });
          });
        }

        break;
      }
    }
  }

  getBagFromFood(foodId) {
    const { bags } = this.state;
    if (bags) {
      var temp = bags.filter((bag) => bag.foodId == foodId);
      if (temp.length > 0) {
        return temp[0];
      }
    }

    return null;
  }

  onPlusQty(bag, food) {
    console.log('-- onPlusQty start : ', bag, food);
    const { me } = this.props;
    
    var price = food.trans[0].price;
    var currency = food.trans[0].languageId.currency;

    if (bag) {
      console.log('-- onPlusQty 1');
      if (bag.qty > bag.food.qty) return;
      bag.qty++;

      this.props.addToBag(me.id, bag.foodId, price, currency, bag.qty).then(() => {
        if (this.props.errorMessage) {
          console.log('-- error : ', this.props.errorMessage);
          return;
        }

        this.setState({
          bags: this.props.bags,
        });
      });
    } else {
      console.log('-- onPlusQty 2 : ', me, food);
      this.props.addToBag(me.id, food._id, price, currency, 1).then(() => {
        if (this.props.errorMessage) {
          console.log('-- error : ', this.props.errorMessage);
          return;
        }

        console.log('-- onPlusQty 3 : ', this.props.bags);
        this.setState({
          bags: this.props.bags,
        });
      });
    }
  }

  onMinusQty(bag, food) {
    const { me } = this.props;
    
    var price = food.trans[0].price;
    var currency = food.trans[0].languageId.currency;

    if (bag) {
      if (bag.qty === 0) return;
      bag.qty--;

      this.props.addToBag(me.id, bag.foodId, price, currency, bag.qty).then(() => {
        if (this.props.errorMessage) {
          console.log('-- error : ', this.props.errorMessage);
          return;
        }

        this.setState({
          bags: this.props.bags,
        });
      });
    } else {
    }
  }

  onCheckOut(bag, food) {
    var qty = bag.qty;
    var note = bag.note;
    this.props.clearBag(this.props.me.id);

    var price = food.trans[0].price;
    var currency = food.trans[0].languageId.currency;

    var that = this;
    setTimeout(function () {
      console.log('-- onCheckOut bags', that.props.bags);
      that.props.addToBag(that.props.me.id, food._id, price, currency, qty, note).then(() => {
        if (that.props.errorMessage) {
          console.log('-- error : ', that.props.errorMessage);
          return;
        }

        console.log('-- onCheckOut bags 1', that.props.bags);
        that.props.history.push('/bag/checkout');
      });
    }, 100);
  }

  renderTopSecHome1() {
    const { categories, classes } = this.props;

    return (
      <div className={classes.topSecHome1}>
        <div>
          <div style={{ marginTop: '95px' }}></div>
          <Typography component="p" variant="h6" className={classes.whiteTitle}>
            Most Popular
          </Typography>
          <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={50}
            totalSlides={3}
            isPlaying={true}
            style={{ width: '100%', marginTop: '5px' }}
          >
            <Slider>
              <Slide index={0} style={{ textAlign: 'center' }}>
                <img
                  alt="avatar"
                  src={'../images/Bitmap.png'}
                  className={classes.image}
                />
              </Slide>
              <Slide index={1} style={{ textAlign: 'center' }}>
                <img
                  alt="avatar"
                  src={'../images/Bitmap-2.png'}
                  className={classes.image}
                />
              </Slide>
              <Slide index={2} style={{ textAlign: 'center' }}>
                <img
                  alt="avatar"
                  src={'../images/Bitmap.png'}
                  className={classes.image}
                />
              </Slide>
            </Slider>
          </CarouselProvider>
        </div>
      </div>
    );
  }

  renderTopSecHome2() {
    const { classes } = this.props;
    return (
      <div className={classes.topSecHome2}>
        {/* <div style={{width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3'}}></div> */}
      </div>
    );
  }

  renderTopSec() {
    const { setting } = this.props;

    if (setting && setting.homeType == 'home1') {
      return this.renderTopSecHome1();
    } else {
      return this.renderTopSecHome2();
    }
  }

  renderMainSecHome1() {
    const { classes } = this.props;
    return (
      <div className={classes.mainSecHome1}>
        <div>
          <Typography component="p" variant="h6" className={classes.blackTitle}>
            Categories
          </Typography>
        </div>
        <div>{this.renderCategories()}</div>
      </div>
    );
  }

  renderCategoryFoods(foods) {
    const { classes } = this.props;

    var foodElems = [];
    if (foods && foods.length > 0) {
      foods.map((food) => {
        var bag = this.getBagFromFood(food._id);
        var qty = bag ? bag.qty : 0;

        foodElems.push(
          <Grid container key={food._Id} className={classes.foodElem}>
            <Grid
              xs={3}
              item
              onClick={() => {
                console.log('-- click');
                this.props.history.push('/dashboard/food/' + food._id);
              }}
            >
              <Box
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url(' + config.serverUrl + food.image + ')',
                  backgroundPosition: 'center',
                  backgroundSize: 'auto 100%',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '5px',
                }}
              ></Box>
            </Grid>
            <Grid xs={9} item style={{ paddingLeft: '10px' }}>
              <div className={classes.foodElemTitleSec}>
                <span className={classes.foodElemTitleSpan}>
                  {textEllipsis(food.trans[0].title, 40, '...')}
                </span>
                <span className={classes.foodElemRatingSpan}>
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
                    {food.rating ? food.rating : 0}
                  </Typography>
                </span>
              </div>
              <Typography
                component="p"
                variant="h6"
                className={classes.foodDetailDesc}
              >
                {food ? textEllipsis(food.trans[0].desc, 60, '...') : ''}
              </Typography>

              <div style={{ display: 'inline-block', width: '50%' }}>
                <div className={classes.qtyActionSec}>
                  <span
                    className={classes.quentityBtn}
                    onClick={this.onPlusQty.bind(this, bag, food)}
                  >
                    +
                  </span>
                  <span>{qty}</span>
                  <span
                    className={classes.quentityBtn}
                    onClick={this.onMinusQty.bind(this, bag, food)}
                  >
                    -
                  </span>
                </div>
              </div>
              {bag && bag.qty > 0 && (
                <IconButton
                  color="inherit"
                  aria-label="check out"
                  onClick={this.onCheckOut.bind(this, bag, food)}
                  className={classes.checkoutBtn}
                >
                  <img
                    src="/images/BASKET.png"
                    style={{ width: '15px', height: '15px' }}
                  />
                </IconButton>
              )}
            </Grid>
          </Grid>
        );
      });
    }

    return <div>{foodElems}</div>;
  }

  renderCategories() {
    const { classes, setting } = this.props;
    const { categories } = this.state;

    var categoryElems = [];
    if (categories && categories.length > 0) {
      categories.map((category) => {
        // if(categoryElems.length > 5) return;
        if (setting.homeType == 'home1') {
          categoryElems.push(
            <Grid xs={6} item key={category._id}>
              <Box p={1}>
                <Link href={'/dashboard/foods/' + category._id}>
                  <img
                    src={config.serverUrl + category.image}
                    className={classes.categoryImage}
                  />
                </Link>
              </Box>
            </Grid>
          );
        } else {
          var foodElems = <div></div>;

          if (category.open && category.foods) {
            foodElems = this.renderCategoryFoods(category.foods);
          }
          categoryElems.push(
            <Grid xs={12} item key={category._id}>
              <div
                style={{
                  width: '100%',
                  height: '33vw',
                  backgroundImage:
                    'url(' + config.serverUrl + category.image + ')',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 100%',
                  borderRadius: '5px',
                  position: 'relative',
                }}
                onClick={this.onClickCategory.bind(this, category)}
              >
                <Typography
                  component="p"
                  variant="h6"
                  className={classes.categoryText}
                >
                  {category.trans[0].name}
                  {category.open ? (
                    <ChevronDown style={{ verticalAlign: 'middle' }} />
                  ) : (
                    <ChevronRight style={{ verticalAlign: 'middle' }} />
                  )}
                </Typography>
              </div>
              {foodElems}
            </Grid>
          );
        }
      });
    }

    return (
      <Grid container spacing={2}>
        {categoryElems}
      </Grid>
    );
  }

  renderMainSecHome2() {
    console.log('-- renderMainSecHome2 start');
    const { classes } = this.props;
    return (
      <div className={classes.mainSecHome2}>
        <div>
          <Typography component="p" variant="h6" className={classes.blackTitle}>
            ORDER NOW
          </Typography>
        </div>
        <div>{this.renderCategories()}</div>
      </div>
    );
  }

  renderMainSec() {
    console.log('-- renderMainSec start');
    const { setting } = this.props;

    if (!setting || setting.homeType == 'home1') {
      return this.renderMainSecHome1();
    } else {
      return this.renderMainSecHome2();
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          {this.renderTopSec()}
          {this.renderMainSec()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isProcessing: getCategoryProcessing(state),
    errorMessage: getCategoryError(state),
    categories: getCategoryCategories(state),
    setting: getSettingSetting(state),
    isProcessingFoods: getFoodProcessing(state),
    errorMessageFoods: getFoodError(state),
    foods: getFoodFoods(state),
    isProcessingBags: getBagProcessing(state),
    errorMessageBags: getBagError(state),
    bags: getBagBags(state),
    me: getCurrentUser(state),
  };
};

export default compose(
  connect(mapStateToProps, {
    getCategories,
    getFoods,
    getBags,
    addToBag,
    clearBag,
  }),
  withStyles(styles)
)(Home);
