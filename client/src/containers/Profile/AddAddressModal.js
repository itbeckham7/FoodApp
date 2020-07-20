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
import { Field, reduxForm, SubmissionError, submit } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getCurrentUser,
  getSignedInWith,
  getAddressAddresses,
  getAddressError,
} from '../../store/selectors';
import { required } from '../../utils/formValidator';
import {
  getAddresses,
  addAddress,
  changeAddressInitialValues,
} from '../../store/actions';

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
    this.state = {
      isVisibleAddAddressDlg: true,
      countryId: '',
      stateId: '',
      cityId: '',
    };

    this.onChangeValue = this.onChangeValue.bind(this);
    this.closeAddAddressDlg = this.closeAddAddressDlg.bind(this);
  }

  componentWillMount() {}
  
  onChangeValue(input, meta, e) {
    var changeValue = {};
    changeValue[input.name] = e.target.value;
    this.props.changeAddressInitialValues(changeValue);

    if(input.name == 'countryId'){
      this.setState({
        countryId: e.target.value,
        stateId: '',
        cityId: ''
      })
    } else if(input.name == 'stateId'){
      this.setState({
        stateId: e.target.value,
        cityId: '',
      })
    } else if(input.name == 'cityId'){
      this.setState({
        cityId: e.target.value,
      })
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

  renderTextAreaField = ({
    input,
    label,
    meta,
    ...custom
  }) => {
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
        fullWidth
        {...input}
        {...custom}
        onChange={this.onChangeValue.bind(this, input, meta)}
        style={{}}
      />
    );
  };

  renderCountryField = ({
    input,
    label,
    meta,
    ...custom
  }) => {
    const { classes } = this.props;
    const { countryId } = this.state;
    var countries = csc.getAllCountries();
    var countriesElem = [
      <MenuItem key={'country-none'} value="">
        <em>None</em>
      </MenuItem>,
    ];
    countries.map((country) => {
      countriesElem.push(
        <MenuItem key={country.id} value={country.id}>
          {country.name}
        </MenuItem>
      );
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

  renderStateField = ({
    input,
    label,
    meta,
    ...custom
  }) => {
    const { classes } = this.props;
    const { countryId, stateId } = this.state;
    var states = csc.getStatesOfCountry(countryId);
    var statesElem = [
      <MenuItem key={'state-none'} value="">
        <em>None</em>
      </MenuItem>,
    ];
    states.map((state) => {
      statesElem.push(
        <MenuItem key={state.id} value={state.id}>
          {state.name}
        </MenuItem>
      );
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
    const { classes } = this.props;
    const { stateId, cityId } = this.state;
    var cities = csc.getCitiesOfState(stateId);
    var cityiesElem = [
      <MenuItem key={'state-none'} value="">
        <em>None</em>
      </MenuItem>,
    ];
    cities.map((city) => {
      cityiesElem.push(
        <MenuItem key={city.id} value={city.id}>
          {city.name}
        </MenuItem>
      );
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
    const { handleSubmit, classes } = this.props;
    const { isVisibleAddAddressDlg } = this.state;
    return (
      <Dialog
        open={isVisibleAddAddressDlg}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.closeAddAddressDlg}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          id="alert-dialog-slide-title"
          style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            paddingBottom: '0',
          }}
        >
          {'Add Address'}
        </DialogTitle>
        <form onSubmit={handleSubmit(this.onSubmitAddAddress)}>
          <DialogContent>
            <Grid container>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="addressName"
                  label="Name"
                  name="addressName"
                  required
                  autoComplete="addressName"
                  component={this.renderTextField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="countryId"
                  label="Country"
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
                  label="State"
                  name="stateId"
                  required
                  autoComplete="stateId"
                  component={this.renderStateField}
                  ref={(ref) => {
                    this.stateRef = ref;
                  }}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="cityId"
                  label="City"
                  name="cityId"
                  required
                  autoComplete="cityId"
                  component={this.renderCityField}
                  ref={(ref) => {
                    this.cityRef = ref;
                  }}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  name="address"
                  label="Address"
                  id="address"
                  autoComplete="address"
                  component={this.renderTextAreaField}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeAddCommentDlg} variant="outlined">
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }

  render() {
    const { classes } = this.props;

    return <div>{this.renderAddAddressModal()}</div>;
  }
}

const validate = (values) => {
  console.log('-- values : ', values);
  const errors = {};
  errors.name = required(values.name);
  errors.countryId = required(values.countryId);
  errors.stateId = required(values.stateId);
  errors.cityId = required(values.cityId);
  errors.address = required(values.address);
  return errors;
};

const mapStateToProps = (state) => {
  console.log('-- mapStateToProps state : ', state);
  return {
    me: getCurrentUser(state),
    authProvider: getSignedInWith(state),
    addresses: getAddressAddresses(state),
    errorMessage: getAddressError(state),
    initialValues: state.address.addressInitialValues,
    enableReinitialize: true,
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
