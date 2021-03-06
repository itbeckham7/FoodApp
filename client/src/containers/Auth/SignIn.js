import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Languages from './Languages';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  signIn,
  facebookSignIn,
  googleSignIn,
  unloadAuthPage,
  getSetting,
} from '../../store/actions';
import {
  getProcessing,
  getError,
  getLangLang,
} from '../../store/selectors';
import { email, minLength, required } from '../../utils/formValidator';
import * as translation from '../../trans';

const styles = (theme) => ({
  root: {
    height: '100%',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundImage: 'url(images/signin-bk.png)',
    backgroundPosition: 'center',
    backgroundSize: 'auto 100%',
    height: '100%',
    padding: theme.spacing(0, 2),
  },
  avatar: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(2),
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(7),
    padding: theme.spacing(0, 2),
  },
  submit: {
    margin: theme.spacing(4, 0, 2),
  },
  logoText: {
    textAlign: 'center',
    color: '#fff',
    marginTop: '7vh',
    fontSize: '2.3rem',
  },
  logoText1: {
    textAlign: 'center',
    color: '#fff',
    marginTop: theme.spacing(1),
    fontSize: '1.5rem',
  },
  title: {
    textAlign: 'center',
    color: '#232020',
    fontSize: '2.5rem',
  },
  actionBtn: {
    display: 'inline-block',
    width: '100%',
    margin: theme.spacing(3, 0),
    padding: theme.spacing(1.5, 0),
    fontSize: '0.9rem',
    fontWeight: '300',
    textTransform: 'uppersize',
    backgroundColor: '#E5293E',
  },
  textLink: {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#888888',
    margin: theme.spacing(2, 0),
  },
  textLinkLink: {
    color: '#333333',
    fontSize: '1rem',
  },
  inputElem: {
    margin: theme.spacing(1, 0),
  },
});

class SignIn extends React.Component {
  constructor(props) {
    super();

    var lang = props.lang ? props.lang.abbr.toLowerCase() : 'en';
    this.state = {
      trans: translation[lang],
    };
  }

  componentWillUnmount() {
    this.props.unloadAuthPage();
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { lang } = this.props;

    if (
      (lang === undefined && nextProps.lang) ||
      (lang && nextProps.lang && lang.abbr !== nextProps.lang.abbr)
    ) {
      this.setState({
        trans: translation[nextProps.lang.abbr.toLowerCase()],
      });
    }
  }

  onSubmit = (formValues) => {
    return this.props.signIn(formValues).then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
      }
    });
  };

  onFacebookResponse = (response) => {
    const payload = {
      accessToken: response.accessToken,
    };
    this.props.facebookSignIn(payload).then(() => {
      // FIXME:
      if (this.props.errorMessage) {
        console.log(this.props.errorMessage);
      }
    });
  };

  onGoogleResponse = (response) => {
    const payload = {
      accessToken: response.accessToken,
    };
    this.props.googleSignIn(payload).then(() => {
      // FIXME:
      if (this.props.errorMessage) {
        console.log(this.props.errorMessage);
      }
    });
  };

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

  render() {
    const {
      classes,
      handleSubmit,
      pristine,
      submitting,
      valid,
      error,
      lang
    } = this.props;
    const { trans } = this.state;

    var direction = lang && lang.abbr === 'AR' ? 'rtl' : 'ltr'

    return (
      <div className={classes.root} style={{direction: direction}}>
        <CssBaseline />
        <div className={classes.paper}>
          <Grid
            container
            style={{
              flex: 1,
              textAlign: 'center',
              marginTop: '16px',
            }}
          >
            <Grid xs={12} item className={classes.logoSec}>
              <Languages />
              <Typography
                component="h4"
                variant="h4"
                className={classes.logoText}
              >
                {trans.auth.logo}
              </Typography>
              <Typography
                component="h4"
                variant="h5"
                className={classes.logoText1}
              >
                {trans.auth.food_shop}
              </Typography>
            </Grid>
          </Grid>
          <Grid container style={{ flex: 1.5 }}>
            <Grid xs={12} item>
              <Typography
                component="h4"
                variant="h4"
                className={classes.title}
              >
                {trans.auth.login}
              </Typography>
              <form
                className={classes.form}
                onSubmit={handleSubmit(this.onSubmit)}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} className={classes.inputElem}>
                    <Field
                      id="email"
                      label={trans.auth.email_address}
                      name="email"
                      autoComplete="email"
                      component={this.renderTextField}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.inputElem}>
                    <Field
                      name="password"
                      label={trans.auth.password}
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      component={this.renderTextField}
                    />
                  </Grid>
                </Grid>
                <Button
                  className={classes.actionBtn}
                  color="secondary"
                  disabled={pristine || submitting || !valid}
                  fullWidth
                  type="submit"
                  variant="contained"
                >
                  {trans.auth.submit}
                </Button>
                <Grid container>
                  <Grid xs={12} item className={classes.textLink}>
                    <span>{trans.auth.dont_have_account}</span>
                    <Link
                      className={classes.textLinkLink}
                      href="/signup"
                      variant="body2"
                    >
                      {trans.auth.sign_up}
                    </Link>
                  </Grid>
                </Grid>
              </form>
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
                  {trans.auth.click_here}
                </Link>
              }
            >
              {trans.auth.email_is_not_verified}
            </Alert>
          )}
        </Snackbar>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isProcessing: getProcessing(state),
    errorMessage: getError(state),
    lang: getLangLang(state),
  };
};

const validate = (values) => {
  const errors = {};
  errors.email = required(values.email) || email(values.email);
  errors.password = required(values.password) || minLength(8)(values.password);
  return errors;
};

export default compose(
  connect(mapStateToProps, {
    signIn,
    facebookSignIn,
    googleSignIn,
    unloadAuthPage,
    getSetting,
  }),
  reduxForm({ form: 'signIn', validate }),
  withStyles(styles)
)(SignIn);
