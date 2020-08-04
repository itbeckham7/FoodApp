import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import csc from 'country-state-city';
import { withStyles } from '@material-ui/core/styles';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getCurrentUser,
  getSignedInWith,
  getAddressAddresses,
  getAddressError,
  getLangLang,
} from '../../store/selectors';
import { required } from '../../utils/formValidator';
import {
  getAddresses,
  addAddress,
  changeAddressInitialValues,
} from '../../store/actions';
import * as translation from '../../trans';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme) => ({
  root: {
    height: '100%',
  },
});

class AddAddressModal extends React.Component {
  constructor(props) {
    super();

    var lang = props.lang ? props.lang.abbr.toLowerCase() : 'en';
    this.state = {
      isVisibleAddAddressDlg: true,
      countryId: '',
      stateId: '',
      cityId: '',
      _t: translation[lang],
      direction: lang === 'ar' ? 'rtl' : 'ltr',
    };

    this.onChangeValue = this.onChangeValue.bind(this);
    this.closeAddAddressDlg = this.closeAddAddressDlg.bind(this);
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps, nextState) {
    const { lang } = this.props;

    if (
      (!lang && nextProps.lang) ||
      (lang && nextProps.lang && lang.abbr !== nextProps.lang.abbr)
    ) {
      this.setState({
        _t: translation[nextProps.lang.abbr.toLowerCase()],
        direction: nextProps.lang.abbr === 'AR' ? 'rtl' : 'ltr',
      });
    }
  }

  onChangeValue(input, meta, e) {
    var changeValue = {};
    changeValue[input.name] = e.target.value;
    this.props.changeAddressInitialValues(changeValue);

    if (input.name === 'countryId') {
      this.setState({
        countryId: e.target.value,
        stateId: '',
        cityId: '',
      });
    } else if (input.name === 'stateId') {
      this.setState({
        stateId: e.target.value,
        cityId: '',
      });
    } else if (input.name === 'cityId') {
      this.setState({
        cityId: e.target.value,
      });
    }
  }

  renderTextField = ({ input, label, meta, ...custom }) => {
    return (
      <TextField
        label={label}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
        variant="outlined"
        margin="none"
        fullWidth
        {...input}
        {...custom}
        onChange={this.onChangeValue.bind(this, input, meta)}
        style={{ marginBottom: '10px' }}
      />
    );
  };

  renderTextAreaField = ({ input, label, meta, ...custom }) => {
    return (
      <TextField
        label={label}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
        multiline={true}
        rows={4}
        fullWidth
        variant="outlined"
        margin="none"
        required
        {...input}
        {...custom}
        onChange={this.onChangeValue.bind(this, input, meta)}
        style={{}}
      />
    );
  };

  renderCountryField = ({ input, label, meta, ...custom }) => {
    const { _t } = this.state;
    var countries = csc.getAllCountries();
    var countriesElem = [
      <MenuItem key={'country-none'} value="">
        <em>{_t.profile.none}</em>
      </MenuItem>,
    ];
    countries.map((country) => {
      countriesElem.push(
        <MenuItem key={country.id} value={country.id}>
          {country.name}
        </MenuItem>
      );

      return country;
    });

    return (
      <TextField
        select
        label={label}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
        variant="outlined"
        fullWidth
        {...input}
        {...custom}
        // onChange={this.onChangeCountry}
        onChange={this.onChangeValue.bind(this, input, meta)}
        style={{ marginBottom: '10px' }}
      >
        {countriesElem}
      </TextField>
    );
  };

  renderStateField = ({ input, label, meta, ...custom }) => {
    const { countryId, _t } = this.state;
    var states = csc.getStatesOfCountry(countryId);
    var statesElem = [
      <MenuItem key={'state-none'} value="">
        <em>{_t.profile.none}</em>
      </MenuItem>,
    ];
    states.map((state) => {
      statesElem.push(
        <MenuItem key={state.id} value={state.id}>
          {state.name}
        </MenuItem>
      );

      return state;
    });

    return (
      <TextField
        select
        label={label}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
        variant="outlined"
        fullWidth
        {...input}
        {...custom}
        // onChange={this.onChangeState}
        onChange={this.onChangeValue.bind(this, input, meta)}
        style={{ marginBottom: '10px' }}
      >
        {statesElem}
      </TextField>
    );
  };

  renderCityField = ({ input, label, meta, ...custom }) => {
    const { stateId, _t } = this.state;
    var cities = csc.getCitiesOfState(stateId);
    var cityiesElem = [
      <MenuItem key={'state-none'} value="">
        <em>{_t.profile.none}</em>
      </MenuItem>,
    ];
    cities.map((city) => {
      cityiesElem.push(
        <MenuItem key={city.id} value={city.id}>
          {city.name}
        </MenuItem>
      );

      return city;
    });

    return (
      <TextField
        select
        label={label}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
        variant="outlined"
        fullWidth
        {...input}
        {...custom}
        // onChange={this.onChangeCity}
        onChange={this.onChangeValue.bind(this, input, meta)}
        style={{ marginBottom: '10px' }}
      >
        {cityiesElem}
      </TextField>
    );
  };

  onSubmitAddAddress = (formValues) => {
    const { me } = this.props;
    return this.props.addAddress(me.id, formValues).then(() => {
      if (this.props.errorMessage) {
        throw new SubmissionError({ _error: this.props.errorMessage });
      }

      this.setState({
        isVisibleAddAddressDlg: false,
        countryId: '',
        stateId: '',
        cityId: '',
      });

      this.props.updateAddresses(this.props.addresses);
      var that = this;
      setTimeout(function () {
        that.props.closeModal();
      }, 100);
    });
  };

  closeAddAddressDlg() {
    this.setState({
      isVisibleAddAddressDlg: false,
      countryId: '',
      stateId: '',
      cityId: '',
    });

    var that = this;
    setTimeout(function () {
      that.props.closeModal();
    }, 100);
  }

  renderAddAddressModal() {
    const { handleSubmit, classes, lang } = this.props;
    const { isVisibleAddAddressDlg, _t } = this.state;

    var direction = lang && lang.abbr === 'AR' ? 'rtl' : 'ltr';

    return (
      <Dialog
        open={isVisibleAddAddressDlg}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.closeAddAddressDlg}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        style={{ direction: direction }}
      >
        <DialogTitle
          id="alert-dialog-slide-title"
          style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            paddingBottom: '0',
          }}
        >
          {_t.profile.add_address}
        </DialogTitle>
        <form onSubmit={handleSubmit(this.onSubmitAddAddress)}>
          <DialogContent>
            <Grid container>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="addressName"
                  label={_t.profile.name}
                  name="addressName"
                  required
                  autoComplete="addressName"
                  component={this.renderTextField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="countryId"
                  label={_t.profile.country}
                  name="countryId"
                  required
                  autoComplete="countryId"
                  component={this.renderCountryField}
                  ref={(ref) => {
                    this.countryRef = ref;
                  }}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="stateId"
                  label={_t.profile.state}
                  name="stateId"
                  required
                  autoComplete="stateId"
                  component={this.renderStateField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="cityId"
                  label={_t.profile.city}
                  name="cityId"
                  required
                  autoComplete="cityId"
                  component={this.renderCityField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  name="address"
                  label={_t.profile.address}
                  id="address"
                  required
                  autoComplete="address"
                  component={this.renderTextAreaField}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeAddAddressDlg} variant="outlined">
              {_t.profile.cancel}
            </Button>
            <Button color="primary" variant="contained" type="submit">
              {_t.profile.submit}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }

  render() {
    return (
      <div>{this.renderAddAddressModal()}</div>
    );
  }
}

const validate = (values) => {
  const errors = {};
  errors.name = required(values.name);
  errors.countryId = required(values.countryId);
  errors.stateId = required(values.stateId);
  errors.cityId = required(values.cityId);
  errors.address = required(values.address);
  return errors;
};

const mapStateToProps = (state) => {
  return {
    me: getCurrentUser(state),
    authProvider: getSignedInWith(state),
    addresses: getAddressAddresses(state),
    errorMessage: getAddressError(state),
    initialValues: state.address.addressInitialValues,
    enableReinitialize: true,
    lang: getLangLang(state),
  };
};

export default compose(
  connect(mapStateToProps, {
    getAddresses,
    addAddress,
    changeAddressInitialValues,
  }),
  reduxForm({ form: 'address', validate }),
  withStyles(styles)
)(AddAddressModal);
