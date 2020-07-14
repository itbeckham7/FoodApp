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
import { email, minLength, required } from '../../utils/formValidator';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

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
    width: '100%'
  },
  mainSec: {
    flex: 1.6,
    overflowY: 'auto',
    padding: theme.spacing(3, 3),
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
    height: '130px'
  }
});

class Foods extends React.Component {
  componentWillMount() {
    console.log('-- params : ', this.props.match.params)
    if( this.props.match.params && this.props.match.params.categoryId ){
      this.props.getFoods(this.props.match.params.categoryId).then(() => {
        if (this.props.errorMessage) {
          throw new SubmissionError({ _error: this.props.errorMessage });
        }
        console.log('-- foods : ', this.props.foods);
      });
    }
  }


  renderFoods() {
    const {
      foods,
      classes
    } = this.props;
console.log('-- renderFoods foods : ', foods)
    var foodElems = [];
    if( foods && foods.length>0 ) {
      foods.map((food) => {
        foodElems.push(
          <Grid xs={6} >
            <Box p={1}>
              <img src={food.image} className={classes.foodImage}/>
            </Box>
          </Grid>
        )
      })
    }
    
    return (
      <Grid container spacing={2}>
        {foodElems}
      </Grid>
    )
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
          <div container className={classes.topSec}>
          </div>
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
            <div>
              {this.renderFoods()}
            </div>
            
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
