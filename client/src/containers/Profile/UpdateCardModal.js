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
  getCardCards,
  getCardError,
} from '../../store/selectors';
import { required } from '../../utils/formValidator';
import {
  getCards,
  updateCard,
  changeCardInitialValues,
} from '../../store/actions';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme) => ({
  root: {
    height: '100%',
  },
});

class UpdateCardModal extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isVisibleUpdateCardDlg: true,
    };

    this.onChangeValue = this.onChangeValue.bind(this);
    this.closeUpdateCardDlg = this.closeUpdateCardDlg.bind(this);
  }

  componentWillMount() {}

  onChangeValue(input, meta, e) {
    var changeValue = {};
    changeValue[input.name] = e.target.value;
    this.props.changeCardInitialValues(changeValue);
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

  renderTypeField = ({ input, label, meta, ...custom }) => {
    const { classes } = this.props;
    const { stateId, cityId } = this.state;
    var cardTypes = [
      {
        id: 'mastercard',
        name: 'Master Card'
      }, {
        id: 'visa',
        name: 'Visa Card'
      }, {
        id: 'knet',
        name: 'Knet'
      }
    ];
    var cardTypesElem = [
      <MenuItem key={'state-none'} value="">
        <em>None</em>
      </MenuItem>,
    ];
    cardTypes.map((cardType) => {
      cardTypesElem.push(
        <MenuItem key={cardType.id} value={cardType.id}>
          {cardType.name}
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
        onChange={this.onChangeValue.bind(this, input, meta)}
        style={{ marginBottom: '10px' }}
      >
        {cardTypesElem}
      </TextField>
    );
  };

  onSubmitUpdateCard = (formValues) => {
    const { selectCard } = this.props;
    if (selectCard) {
      this.props.updateCard(selectCard._id, formValues).then(() => {
        if (this.props.errorMessage) {
          throw new SubmissionError({ _error: this.props.errorMessage });
        }

        this.setState({
          isVisibleUpdateCardDlg: false,
        });

        this.props.updateCards(this.props.cards);
        var that = this;
        setTimeout(function () {
          that.props.closeModal();
        }, 100);
      });
    }
  };

  closeUpdateCardDlg() {
    this.setState({
      isVisibleUpdateCardDlg: false,
    });

    var that = this;
    setTimeout(function () {
      that.props.closeModal();
    }, 100);
  }

  renderUpdateCardModal() {
    const { handleSubmit, classes } = this.props;
    const { isVisibleUpdateCardDlg } = this.state;
    return (
      <Dialog
        open={isVisibleUpdateCardDlg}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.closeUpdateCardDlg}
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
          {'Update Card'}
        </DialogTitle>
        <form onSubmit={handleSubmit(this.onSubmitUpdateCard)}>
          <DialogContent>
            <Grid container>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="cardType"
                  label="Card Type"
                  name="cardType"
                  required
                  autoComplete="cardType"
                  component={this.renderTypeField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="holderName"
                  label="Holder Name"
                  name="holderName"
                  required
                  autoComplete="holderName"
                  component={this.renderTextField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="cardNumber"
                  label="Card Number"
                  name="cardNumber"
                  required
                  autoComplete="cardNumber"
                  component={this.renderTextField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="expireDate"
                  label="Expire Date"
                  name="expireDate"
                  required
                  autoComplete="expireDate"
                  component={this.renderTextField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="cvv"
                  label="CVV"
                  name="cvv"
                  required
                  autoComplete="cvv"
                  component={this.renderTextField}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeUpdateCardDlg} variant="outlined">
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

    return <div>{this.renderUpdateCardModal()}</div>;
  }
}

const validate = (values) => {
  const errors = {};
  errors.cardType = required(values.cardType);
  errors.holderName = required(values.holderName);
  errors.cardNumber = required(values.cardNumber);
  errors.expireDate = required(values.expireDate);
  errors.cvv = required(values.cvv);
  return errors;
};

const mapStateToProps = (state) => {
  return {
    me: getCurrentUser(state),
    authProvider: getSignedInWith(state),
    cards: getCardCards(state),
    errorMessage: getCardError(state),
    initialValues: state.card.cardInitialValues,
    enableReinitialize: true,
  };
};

export default compose(
  connect(mapStateToProps, {
    getCards,
    updateCard,
    changeCardInitialValues,
  }),
  reduxForm({ form: 'card', validate }),
  withStyles(styles)
)(UpdateCardModal);