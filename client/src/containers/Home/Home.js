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
import { getCategories } from '../../store/actions';
import {
  getCategoryCategories,
  getCategoryProcessing,
  getCategoryError,
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
import config from '../../config'

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
    backgroundImage: 'url(../images/picturemessage_intra0vh.wzc@2x.png)',
    backgroundPosition: 'bottom center',
    backgroundSize: '100% auto',
    width: '100%',
  },
  mainSec: {
    flex: 1.5,
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
  categoryImage: {
    borderRadius: '8px',
    width: '100%',
    height: '130px',
  },
});

class Home extends React.Component {
  componentWillMount() {
    this.props.getCategories().then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
      }
      console.log('-- categories : ', this.props.categories);
    });
  }

  renderCategories() {
    const { categories, classes } = this.props;
    console.log('-- renderCategories categories : ', categories);
    var categoryElems = [];
    if (categories && categories.length > 0) {
      categories.map((category) => {
        // if(categoryElems.length > 5) return;
        categoryElems.push(
          <Grid xs={6}>
            <Box p={1}>
              <Link href={'/dashboard/foods/' + category._id}>
                <img src={config.serverUrl + category.image} className={classes.categoryImage} />
              </Link>
            </Box>
          </Grid>
        );
      });
    }

    return (
      <Grid container spacing={2}>
        {categoryElems}
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
    } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div container className={classes.topSec}>
            <div>
              <div style={{ marginTop: '95px' }}></div>
              <Typography
                component="p"
                variant="h6"
                className={classes.whiteTitle}
              >
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
          <div container className={classes.mainSec}>
            <div>
              <Typography
                component="p"
                variant="h6"
                className={classes.blackTitle}
              >
                Categories
              </Typography>
            </div>
            <div>{this.renderCategories()}</div>
          </div>
        </div>
      </div>
    );
  }
}

const maptStateToProps = (state) => {
  return {
    isProcessing: getCategoryProcessing(state),
    errorMessage: getCategoryError(state),
    categories: getCategoryCategories(state),
  };
};

export default compose(
  connect(maptStateToProps, { getCategories }),
  withStyles(styles)
)(Home);
