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
import { withStyles } from '@material-ui/core/styles';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getCurrentUser,
  getSignedInWith,
  getCardCards,
  getCardError,
  getLangLang,
} from '../../store/selectors';
import { required } from '../../utils/formValidator';
import {
  getCards,
  updateCard,
  changeCardInitialValues,
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

class UpdateCardModal extends React.Component {
  constructor(props) {
    super();

    var lang = props.lang ? props.lang.abbr.toLowerCase() : 'en';
    this.state = {
      isVisibleUpdateCardDlg: true,
      _t: translation[lang],
      direction: lang === 'ar' ? 'rtl' : 'ltr',
    };

    this.onChangeValue = this.onChangeValue.bind(this);
    this.closeUpdateCardDlg = this.closeUpdateCardDlg.bind(this);
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
    const { _t } = this.state;
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
        <em>{_t.profile.none}</em>
      </MenuItem>,
    ];
    cardTypes.map((cardType) => {
      cardTypesElem.push(
        <MenuItem key={cardType.id} value={cardType.id}>
          {cardType.name}
        </MenuItem>
      );

      return cardType
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
    const { handleSubmit, classes, lang } = this.props;
    const { isVisibleUpdateCardDlg, _t } = this.state;
    
    var direction = lang && lang.abbr === 'AR' ? 'rtl' : 'ltr';

    return (
      <Dialog
        open={isVisibleUpdateCardDlg}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.closeUpdateCardDlg}
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
          {_t.profile.update_card}
        </DialogTitle>
        <form onSubmit={handleSubmit(this.onSubmitUpdateCard)}>
          <DialogContent>
            <Grid container>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="cardType"
                  label={_t.profile.card_type}
                  name="cardType"
                  required
                  autoComplete="cardType"
                  component={this.renderTypeField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="holderName"
                  label={_t.profile.holder_name}
                  name="holderName"
                  required
                  autoComplete="holderName"
                  component={this.renderTextField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="cardNumber"
                  label={_t.profile.card_number}
                  name="cardNumber"
                  required
                  autoComplete="cardNumber"
                  component={this.renderTextField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="expireDate"
                  label={_t.profile.expire_date}
                  name="expireDate"
                  required
                  autoComplete="expireDate"
                  component={this.renderTextField}
                />
              </Grid>
              <Grid item xs={12} className={classes.inputElem}>
                <Field
                  id="cvv"
                  label={_t.profile.cvv}
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
    lang: getLangLang(state),
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
