import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey,
} from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import { Facebook, Google } from 'mdi-material-ui';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  signIn,
  facebookSignIn,
  googleSignIn,
  unloadAuthPage,
} from '../../store/actions';
import { getProcessing, getError } from '../../store/selectors';
import { email, minLength, required } from '../../utils/formValidator';

const styles = (theme) => ({
  root: {
    height: '100%',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundImage: 'url(images/top-view-photo-of-restaurant-4.png)',
    backgroundPosition: 'center',
    height: '100%',
  },
  avatar: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(2),
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  center: {
    textAlign: 'center',
  },
  logoImage: {
    width: '100%',
  },
  logoText: {
    textAlign: 'center',
    color: '#fff',
    marginTop: '20px',
  },
  actionSec: {
    flex: 1.5,
    flexDirection: 'row',
  },
  actionBtn: {
    display: 'inline-block',
    width: '60%',
    margin: '0 20% 10px',
    padding: '12px 0',
    fontSize: '0.8rem',
    fontWeight: 'normal',
    textTransform: 'capitalize',
    backgroundColor: '#E5293E',
  },
  textLink: {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#fff',
  },
  textLinkLink: {
    color: '#E4283D',
    fontSize: '1rem',
  },
});

class Launch extends React.Component {
  componentWillUnmount() {
    this.props.unloadAuthPage();
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

  onClickGuest = () => {
    window.location = '/signup';
  };

  onClickLogin = () => {
    window.location = '/signin';
  };

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
        <CssBaseline />
        <div className={classes.paper}>
          <Grid container style={{ flex: 1 }}></Grid>
          <Grid container style={{ flex: 1.7 }}>
            <Grid xs={1}></Grid>
            <Grid xs={10}>
              <img
                alt="avatar"
                src={'images/picturemessage_intra0vh.wzc.png'}
                className={classes.logoImage}
              />
            </Grid>
            <Grid xs={1}></Grid>
          </Grid>
          <Grid container style={{ flex: 1.5 }}>
            <Grid xs={12}>
              <Typography
                component="h4"
                variant="h5"
                className={classes.logoText}
              >
                Food Shop
              </Typography>
            </Grid>
          </Grid>
          <Grid container className={classes.actionSec}>
            <Grid xs={12}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.actionBtn}
                onClick={this.onClickGuest}
              >
                Enter as Guest
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.actionBtn}
                onClick={this.onClickLogin}
              >
                Login
              </Button>
            </Grid>
            <Grid xs={12} className={classes.textLink}>
              <span>Don't have a account? </span>
              <Link
                className={classes.textLinkLink}
                href="/signup"
                variant="body2"
              >
                Sign up
              </Link>
            </Grid>
          </Grid>
        </div>
        <Snackbar open={!!error}>
          {error !== 'Email is not verified' ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Alert
              severity="error"
              action={
                <Link href="/request-verification-email" variant="body2">
                  Click here
                </Link>
              }
            >
              Email is not verified. Have not received verification email?
            </Alert>
          )}
        </Snackbar>
      </div>
    );
  }
}
const maptStateToProps = (state) => {
  return {
    isProcessing: getProcessing(state),
    errorMessage: getError(state),
  };
};

const validate = (values) => {
  const errors = {};
  errors.email = required(values.email) || email(values.email);
  errors.password = required(values.password) || minLength(8)(values.password);
  return errors;
};

export default compose(
  connect(maptStateToProps, {
    signIn,
    unloadAuthPage,
  }),
  withStyles(styles)
)(Launch);
