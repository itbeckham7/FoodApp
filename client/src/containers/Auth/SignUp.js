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
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { signUp, unloadAuthPage } from '../../store/actions';
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
    backgroundImage: 'url(images/signup-bk.png)',
    backgroundPosition: 'top',
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
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 2),
  },
  submit: {
    margin: theme.spacing(4, 0, 2),
  },
  logoSec: {
    textAlign: 'center', 
    marginTop: theme.spacing(2)
  },
  logoText: {
    textAlign: 'center',
    color: '#fff',
    marginTop: theme.spacing(1.5),
    fontSize: '2.4rem',
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
    margin: theme.spacing(0, 0),
  },
  textLinkLink: {
    color: '#333333',
    fontSize: '1rem',
  },
  inputElem: {
    margin: theme.spacing(1, 0),
  },
  textDescription: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#E4283D',
    margin: theme.spacing(2, 0),
  },
});

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

class SignUp extends React.Component {
  state = { status: false };

  onSubmit = (formValues) => {
    return this.props.signUp(formValues).then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
      }
      this.props.history.push('/signin');
    });
  };

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
      autoComplete="off"
      required
      fullWidth
      {...input}
      {...custom}
    />
  );

  renderTextFieldNoRequired = ({
    input,
    label,
    meta: { touched, error },
    ...custom
  }) => (
    <TextField
      label={label}
      error={touched && !!error}
      helperText={touched && error}
      variant="outlined"
      margin="none"
      autoComplete="off"
      required={false}
      fullWidth
      {...input}
      {...custom}
    />
  );

  onChangeStatus = (status) => {
    this.setState({ status: !this.state.status });
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

    const { status } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <div className={classes.paper}>
          <Grid container style={{ flex: 1 }}>
            <Grid xs={12} className={classes.logoSec}>
              <IOSSwitch checked={status} onChange={this.onChangeStatus}/>
              <Typography
                component="h4"
                variant="h4"
                className={classes.logoText}
              >
                Anfas Alteeb
              </Typography>
              <Typography
                component="h4"
                variant="h5"
                className={classes.logoText}
                style={{fontSize: '1.5rem'}}
              >
                Food Shop
              </Typography>
            </Grid>
          </Grid>
          <Grid container style={{ flex: 2, overflowY: 'auto' }}>
            <Grid xs={12}>
              <Typography component="h4" variant="h4" className={classes.title}>
                Sign up
              </Typography>
              <form
                className={classes.form}
                onSubmit={handleSubmit(this.onSubmit)}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      id="username"
                      label="Username"
                      name="username"
                      component={this.renderTextField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="email"
                      label="Email Address"
                      name="email"
                      component={this.renderTextField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="phone"
                      label="Phone"
                      name="phone"
                      component={this.renderTextField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
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
                  Sign Up
                </Button>
                <Grid container>
                  <Grid xs={12} className={classes.textLink}>
                    <span>Already have a account? </span>
                    <Link
                      className={classes.textLinkLink}
                      href="/signin"
                      variant="body2"
                    >
                      Login
                    </Link>
                  </Grid>
                  <Grid xs={12} className={classes.textDescription}>
                    <span>
                      By signing up you accept the Terms of
                      <br />
                      Service and Privacy Policy.
                    </span>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </div>
        <Snackbar open={!!error}>
          <Alert severity="error">{error}</Alert>
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
  errors.username = required(values.username) || minLength(4)(values.username);
  errors.phone = required(values.phone);
  errors.email = required(values.email) || email(values.email);
  errors.password = required(values.password) || minLength(8)(values.password);
  return errors;
};

export default compose(
  connect(maptStateToProps, { signUp, unloadAuthPage }),
  reduxForm({ form: 'signUp', validate }),
  withStyles(styles)
)(SignUp);
