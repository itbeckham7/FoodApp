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
import Switch from '@material-ui/core/Switch';
import Rating from '@material-ui/lab/Rating';
import { withStyles } from '@material-ui/core/styles';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFoods } from '../../store/actions';
import {
  getFoodFoods,
  getFoodProcessing,
  getFoodError,
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
    backgroundImage: 'url(../../images/home-food-top.png)',
    backgroundPosition: 'center center',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    position: 'relative',
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
    fontWeight: '400',
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
    fontWeight: '400',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    padding: theme.spacing(1, 0),
  },
  foodDesc: {
    color: '#000',
    fontWeight: '400',
    textOverflow: 'ellipsis',
    fontSize: '0.7rem',
  },
  foodPrice: {
    color: '#000',
    fontWeight: '400',
    textAlign: 'right',
    marginTop: '5px',
    padding: theme.spacing(0.5, 1),
  },
  foodRating: {
    color: '#ffb400',
    fontWeight: '400',
    fontSize: '0.8rem',
    padding: theme.spacing(0, 1),
  },
});

class Foods extends React.Component {
  state = { category: null };

  componentWillMount() {
    console.log('-- params : ', this.props.match.params);
    if (this.props.match.params && this.props.match.params.categoryId) {
      this.props.getFoods(this.props.match.params.categoryId).then(() => {
        if (this.props.errorMessage) {
          throw new SubmissionError({ _error: this.props.errorMessage });
        }
        console.log('-- foods : ', this.props.foods);

        var foods = this.props.foods;
        if (foods.length > 0 && foods[0].categoryId.length > 0) {
          var category = foods[0].categoryId[0];
          this.setState({ category: category });
        }
      });
    }
  }

  renderFoods() {
    const { foods, classes } = this.props;
    console.log('-- renderFoods foods : ', foods);
    var foodElems = [];
    if (foods && foods.length > 0) {
      foods.map((food) => {
        foodElems.push(
          <Grid xs={6} style={{ padding: '5px' }}>
            <Link className={classes.foodElem} href={'/dashboard/food/' + food._id}>
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
                {food ? textEllipsis(food.trans[0].title, 15, '...') : ''}
              </Typography>

              <div style={{verticalAlign: 'middle'}}>
                <Rating name="read-only" value={4} readOnly size="small" />
                <Typography component="span" className={classes.foodRating}>
                  4
                </Typography>
              </div>

              <Typography
                component="p"
                variant="subtitle2"
                className={classes.foodDesc}
              >
                {food ? textEllipsis(food.trans[0].desc, 40, '...') : ''}
              </Typography>

              <Typography
                component="p"
                variant="body2"
                className={classes.foodPrice}
              >
                {food
                  ? food.trans[0].languageId.currency + food.trans[0].price
                  : ''}
              </Typography>
            </Link>
          </Grid>
        );
      });
    }

    return (
      <Grid container spacing={2}>
        {foodElems}
      </Grid>
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
      foods,
    } = this.props;

    const { category } = this.state;
    console.log('-- category : ', category);

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div
            container
            className={classes.topSec}
            style={{
              backgroundImage: category
                ? 'url(' + config.serverUrl + category.image + ')'
                : 'none',
            }}
          >
            <Typography
              component="p"
              variant="h6"
              className={classes.whiteTitle}
            >
              {category ? category.trans[0].name : ''}
            </Typography>
          </div>
          <div container className={classes.mainSec}>
            <div>{this.renderFoods()}</div>
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
    foods: getFoodFoods(state),
  };
};

export default compose(
  connect(maptStateToProps, { getFoods }),
  withStyles(styles)
)(Foods);
