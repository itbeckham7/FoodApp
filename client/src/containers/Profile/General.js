import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import csc from 'country-state-city';
import { withStyles } from '@material-ui/core/styles';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getCurrentUser, getSignedInWith, getLangLang } from '../../store/selectors';
import { email, required } from '../../utils/formValidator';
import { updateProfile } from '../../store/actions';
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
    padding: theme.spacing(5, 3, 0),
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  mainSec: {
    flex: 4,
    width: '100%',
    overflowY: 'auto',
    padding: theme.spacing(3),
    backgroundColor: '#fff',
  },
  image: {
    backgroundColor: '#f5f5f5',
    width: '30%',
    borderRadius: '100px',
  },
  whiteText: {
    color: '#333',
    fontSize: '1.3rem',
    fontWeight: 'normal',
    marginTop: theme.spacing(1),
  },
  tabText: {
    fontWeight: '300',
    fontSize: '0.7rem',
  },
  tabPanel: {
    paddingTop: '20px',
  },
  actionBtn: {
    // borderRadius: '50px',
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1.5, 0),
  },
  formControl: {
    width: '100%',
  },
});

class Profile extends React.Component {
  
  constructor(props){
    super();

    var lang = props.lang ? props.lang.abbr.toLowerCase() : 'en';
    this.state = {
      me: props.me,
      _t: translation[lang],
      direction: lang === 'ar' ? 'rtl' : 'ltr'
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

  renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => {
    return (
      <TextField
        label={label}
        error={touched && !!error}
        helperText={touched && error}
        variant="outlined"
        margin="none"
        fullWidth
        {...input}
        {...custom}
        value={input.value}
        style={{ marginBottom: '30px' }}
      />
    );
  };

  renderCountryField = ({
    input,
    label,
    meta: { touched, error },
    ...custom
  }) => {
    const { classes } = this.props;
    const { _t } = this.state;
    var countries = csc.getAllCountries();
    var countriesElem = [
      <MenuItem key={'country-none'} value="">
        <em>{_t.profile.none}</em>
      </MenuItem>,
    ];
    countries.map((country) => {
      countriesElem.push(
        <MenuItem key={country.id} value={country.sortname}>{country.name}</MenuItem>
      );

      return country;
    });

    return (
      <FormControl className={classes.formControl}>
        <InputLabel
          id="country-label"
          className={classes.countryLabel}
          variant="outlined"
          required
        >
          {_t.profile.country}
        </InputLabel>
        <Select
          labelId="country-label"
          label={label}
          error={touched && !!error}
          variant="outlined"
          margin="none"
          fullWidth
          {...input}
          {...custom}
          value={input.value}
          style={{ marginBottom: '30px' }}
        >
          {countriesElem}
        </Select>
      </FormControl>
    );
  };

  onSubmit = (formValues) => {
    const { me } = this.props;
    return this.props.updateProfile(me.id, formValues).then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
      }
      
      this.setState({me: this.props.me})
    });
  };

  render() {
    const {
      classes,
      authProvider,
      handleSubmit,
      pristine,
      submitting,
      valid,
    } = this.props;
    const {me, _t} = this.state

    let picture = '';
    if (me.provider) {
      picture = me.provider[authProvider].picture;
    }

    picture = picture ? picture : '/logo-circle512.png';

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div  className={classes.topSec}>
            <img alt="avatar" src={picture} className={classes.image} />
            <Typography
              variant="h4"
              color="textSecondary"
              component="h4"
              className={classes.whiteText}
            >
              {me.firstName} {me.lastName}
            </Typography>
          </div>
          <div  className={classes.mainSec}>
            <div className={classes.tabPanel}>
              <form onSubmit={handleSubmit(this.onSubmit)}>
                <Field
                  id="firstName"
                  label={_t.checkout.first_name}
                  required
                  name="firstName"
                  autoComplete="firstName"
                  component={this.renderTextField}
                />
                <Field
                  id="lastName"
                  label={_t.checkout.last_name}
                  name="lastName"
                  required
                  autoComplete="lastName"
                  component={this.renderTextField}
                />
                <Field
                  id="username"
                  label={_t.auth.username}
                  name="username"
                  required
                  autoComplete="username"
                  component={this.renderTextField}
                />
                <Field
                  id="email"
                  label={_t.auth.email_address}
                  name="email"
                  required
                  autoComplete="email"
                  component={this.renderTextField}
                />
                <Field
                  id="phone"
                  label={_t.auth.phone}
                  name="phone"
                  required
                  autoComplete="phone"
                  component={this.renderTextField}
                />
                <Field
                  id="country"
                  label={_t.profile.country}
                  name="country"
                  required
                  autoComplete="country"
                  component={this.renderCountryField}
                />
                <Button
                  className={classes.actionBtn}
                  color="secondary"
                  disabled={pristine || submitting || !valid}
                  fullWidth
                  type="submit"
                  variant="contained"
                >
                  {_t.profile.save}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      // <Grid container justify="center">
      //   <Grid xs={12} sm={5} md={3} item>
      //     <Card>
      //       <CardActionArea>
      //         <CardMedia
      //           component={() => (
      //             <div>
      //               <img alt="avatar" src={picture} className={classes.image} />
      //             </div>
      //           )}
      //         />
      //         <CardContent>
      //           <Typography gutterBottom variant="h5" component="h2">
      //             {`${me.firstName} ${me.lastName}`}
      //           </Typography>
      //           <Typography variant="body2" color="textSecondary" component="p">
      //             Joined in {new Date(me.createdAt).getFullYear()}
      //           </Typography>
      // <Typography variant="body2" color="textSecondary" component="p">
      //   You are logged in as <b>{me.username}</b>
      // </Typography>
      //         </CardContent>
      //       </CardActionArea>
      //     </Card>
      //   </Grid>
      // </Grid>
    );
  }
}

const validate = (values) => {
  const errors = {};
  errors.firstName = required(values.firstName);
  errors.lastName = required(values.lastName);
  errors.username = required(values.username);
  errors.email = required(values.email) || email(values.email);
  errors.phone = required(values.phone);
  errors.country = required(values.country);
  return errors;
};

const mapStateToProps = (st) => {
  var me = getCurrentUser(st);
  const {
    firstName,
    lastName,
    username,
    email,
    phone,
    country,
    state,
    city,
    address,
  } = me;
  var initialValues = {
    firstName,
    lastName,
    username,
    email,
    phone,
    country,
    state,
    city,
    address,
  };
  return {
    me: me,
    authProvider: getSignedInWith(st),
    initialValues: initialValues,
    lang: getLangLang(st),
  };
};

export default compose(
  connect(mapStateToProps, { updateProfile }),
  reduxForm({ form: 'profile', validate }),
  withStyles(styles)
)(Profile);
