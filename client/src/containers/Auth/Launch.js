import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Languages from './Languages';
import { SubmissionError } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { signIn, unloadAuthPage } from '../../store/actions';
import {
  getProcessing,
  getError,
  getCurrentUser,
  getLangLang,
} from '../../store/selectors';
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
    width: '70%',
    display: 'inline-block',
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
    fontWeight: '300',
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
  langListWrap: {
    width: '40px',
  },
  langListElem: {
    width: '100%',
    textAlign: 'center',
    padding: '5px 0',
  },
});

class Launch extends React.Component {
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
    var formValues = new FormData();
    formValues.append('email', config.guestEmail);
    formValues.append('password', config.guestPassword);
    return this.props.signIn(formValues).then((ret) => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
      }
    });
  };

  onClickLogin = () => {
    this.props.history.push('/signin');
  };

  render() {
    const { classes, error } = this.props;
    const { trans } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <div className={classes.paper}>
          <Grid container style={{ flex: 1 }}>
            <Languages />
          </Grid>
          <div style={{ flex: 1.7, textAlign: 'center', width: '100%' }}>
            <img
              alt="avatar"
              src={'images/picturemessage_intra0vh.wzc.png'}
              className={classes.logoImage}
            />
          </div>
          <Grid container style={{ flex: 1.5 }}>
            <Grid xs={12} item>
              <Typography
                component="h4"
                variant="h5"
                className={classes.logoText}
              >
                {trans.auth.food_shop}
              </Typography>
            </Grid>
          </Grid>
          <Grid container className={classes.actionSec}>
            <Grid xs={12} item>
              <Button
                variant="contained"
                color="secondary"
                className={classes.actionBtn}
                onClick={this.onClickGuest}
              >
                {trans.auth.enter_as_guest}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.actionBtn}
                onClick={this.onClickLogin}
              >
                {trans.auth.login}
              </Button>
            </Grid>
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
    me: getCurrentUser(state),
    lang: getLangLang(state),
  };
};

export default compose(
  connect(mapStateToProps, {
    signIn,
    unloadAuthPage,
  }),
  withStyles(styles)
)(Launch);
