import React from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFoods } from '../../store/actions';
import {
  getFoodFoods,
  getFoodProcessing,
  getFoodError,
  getLangLang,
} from '../../store/selectors';
import { textEllipsis, getTrans, getCatTrans } from '../../utils';
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
    backgroundImage: 'url(../../images/home-food-top.png)',
    backgroundPosition: 'center center',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    position: 'relative',
  },
  topSecInner: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%',
  },
  mainSec: {
    flex: 2.5,
    overflowY: 'auto',
    padding: theme.spacing(3, 2),
    width: '100%',
    marginTop: '-60px',
    zIndex: '100',
  },
  whiteTitle: {
    color: '#fff',
    fontWeight: 'normal',
    padding: theme.spacing(0, 3),
    fontSize: '1.5rem',
    position: 'absolute',
    left: '0',
    bottom: '70px',
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
    display: 'block',
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
    fontWeight: 'normal',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    padding: theme.spacing(1, 0, 0),
  },
  foodDesc: {
    color: '#666',
    fontWeight: '300',
    textOverflow: 'ellipsis',
    fontSize: '0.7rem',
    lineHeight: '0.9rem',
    textAlign: 'left',
  },
  foodPrice: {
    color: '#000',
    fontWeight: '300',
    textAlign: 'right',
    marginTop: '5px',
    fontSize: '0.8rem',
    padding: theme.spacing(0.5, 1),
  },
  foodRating: {
    color: '#ffb400',
    fontWeight: '300',
    fontSize: '0.8rem',
    padding: theme.spacing(0, 1),
  },
});

class Foods extends React.Component {

  constructor(props) {
    super();

    var lang = props.lang ? props.lang.abbr.toLowerCase() : 'en';
    this.state = { 
      category: null,
      _t: translation[lang],
      direction: lang === 'ar' ? 'rtl' : 'ltr'
    };
  }

  componentWillMount() {
    if (this.props.match.params && this.props.match.params.categoryId) {
      this.props.getFoods(this.props.match.params.categoryId).then(() => {
        if (this.props.errorMessage) {
          console.log('-- error : ', this.props.errorMessage);
        }

        var foods = this.props.foods;
        if (foods.length > 0 && foods[0].categoryId.length > 0) {
          var category = foods[0].categoryId[0];
          this.setState({ category: category });
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

  renderFoods() {
    const { foods, classes } = this.props;
    const { direction } = this.state;
    var lang = this.props.lang ? this.props.lang.abbr : 'EN';

    var foodElems = [];
    if (foods && foods.length > 0) {
      foods.map((food) => {
        var trans = getTrans(food, lang);
        foodElems.push(
          <Grid xs={6} item key={food._id} style={{ padding: '5px' }}>
            <Link
              className={classes.foodElem}
              href={'/dashboard/food/' + food._id}
            >
              <div
                className={classes.foodImage}
                style={{
                  backgroundImage: food
                    ? 'url(' + config.serverUrl + food.image + ')'
                    : 'none',
                }}
              ></div>
              <Typography
                component="p"
                variant="body2"
                className={classes.foodTitle}
              >
                {trans ? textEllipsis(trans.title, 15, '...') : ''}
              </Typography>

              <div style={{ verticalAlign: 'middle' }}>
                <Rating
                  name="read-only"
                  value={food.rating}
                  readOnly
                  size="small"
                />
                <Typography component="span" className={classes.foodRating}>
                  {food.rating}
                </Typography>
              </div>

              <Typography
                component="p"
                variant="subtitle2"
                className={classes.foodDesc}
                dangerouslySetInnerHTML={{__html: trans ? textEllipsis(trans.desc, 40, '...') : ''}}
                style={{textAlign: direction === 'rtl' ? 'right' : 'left'}}
              >
              </Typography>

              <Typography
                component="p"
                variant="body2"
                className={classes.foodPrice}
              >
                {trans && (
                  <span style={{textDecoration: 'line-through', paddingRight: '10px', fontSize: '0.8rem', color: '#666'}}>
                    {trans.languageId.currency + trans.oldPrice}
                  </span>
                )}
                {trans && (
                  <span style={{fontWeight: 'normal'}}>
                    {trans.languageId.currency + trans.price}
                  </span>
                )}
              </Typography>
            </Link>
          </Grid>
        );

        return food
      });
    }

    return (
      <Grid container spacing={2}>
        {foodElems}
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    const { category } = this.state;

    var lang = this.props.lang ? this.props.lang.abbr : 'EN';
    var catTrans = getCatTrans(category, lang);

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div
            className={classes.topSec}
            style={{
              backgroundImage: category
                ? 'url(' + config.serverUrl + category.image + ')'
                : 'none',
            }}
          >
            <div className={classes.topSecInner}>
              <Typography
                component="p"
                variant="h6"
                className={classes.whiteTitle}
              >
                {catTrans ? catTrans.name : ''}
              </Typography>
            </div>
          </div>
          <div className={classes.mainSec}>
            <div>{this.renderFoods()}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isProcessing: getFoodProcessing(state),
    errorMessage: getFoodError(state),
    foods: getFoodFoods(state),
    lang: getLangLang(state),
  };
};

export default compose(
  connect(mapStateToProps, { getFoods }),
  withStyles(styles)
)(Foods);
