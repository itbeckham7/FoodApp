import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddCardModal from './AddCardModal';
import UpdateCardModal from './UpdateCardModal';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getCurrentUser,
  getSignedInWith,
  getCardCards,
  getCardActiveCard,
  getLangLang,
} from '../../store/selectors';
import {
  updateProfile,
  getCards,
  deleteCard,
  updateActiveCard,
  getActiveCard,
  changeCardInitialValues,
} from '../../store/actions';
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
    flex: 15,
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
  pageTitle: {
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
    position: 'absolute',
    right: '30px',
    bottom: '120px',
    padding: theme.spacing(1.5, 3),
  },
  formControl: {
    width: '100%',
  },
  noCard: {
    textAlign: 'center',
    color: '#333',
    fontWeight: '300',
    fontSize: '1rem',
    padding: '10%',
  },
  cardElem: {
    verticalAlign: 'top',
    marginBottom: '30px',
    backgroundPosition: 'center center',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
  },
  cardElemLeft: {
    padding: theme.spacing(3, 3, 2),
  },
  cardElemRight: {
    position: 'absolute',
    bottom: 0,
  },
  cardElemNumber: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '25px',
    marginBottom: '15px',
  },
  cardElemNumberPart: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1.4rem',
  },
  cardElemHolder: {
    display: 'inline-block',
    width: '70%',
  },
  cardElemExpire: {
    display: 'inline-block',
    width: '28%',
  },
  cardElemLabel: {
    color: '#fff',
    fontWeight: '300',
    fontSize: '0.8rem',
    marginBottom: '1px',
    display: 'block',
  },
  cardElemValue: {
    color: '#fff',
    fontWeight: 'normal',
    fontSize: '1.1rem',
    display: 'block',
  },
  cardElemInfo: {
    color: '#333',
    fontWeight: '300',
    fontSize: '0.8rem',
  },
});

class Card extends React.Component {
  constructor(props) {
    super();

    var lang = props.lang ? props.lang.abbr.toLowerCase() : 'en';
    this.state = {
      me: props.me,
      cards: null,
      selectCard: null,
      isVisibleAddCardDlg: false,
      isVisibleUpdateCardDlg: false,
      _t: translation[lang],
      direction: lang === 'ar' ? 'rtl' : 'ltr',
    };

    this.activeCard = this.activeCard.bind(this);
    this.onClickCardElem = this.onClickCardElem.bind(this);
    this.closeAddCardDlg = this.closeAddCardDlg.bind(this);
    this.closeUpdateCardDlg = this.closeUpdateCardDlg.bind(this);
    this.activeCard = this.activeCard.bind(this);
    this.updateCards = this.updateCards.bind(this);
  }

  componentWillMount() {
    const { me } = this.props;

    this.props.getCards(me.id).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        return;
      }

      var cards = this.props.cards;
      this.setState({ cards });
    });
  }

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

  closeAddCardDlg() {
    this.setState({
      isVisibleAddCardDlg: false,
    });
  }

  closeUpdateCardDlg() {
    this.setState({
      isVisibleUpdateCardDlg: false,
    });
  }

  activeCard(cardId) {
    const { me } = this.props;

    return this.props.updateActiveCard(me.id, cardId).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        return;
      }

      this.setState({
        cards: this.props.cards,
      });
    });
  }

  onClickCardElem(cardInfo) {
    const { cardType, holderName, cardNumber, expireDate, cvv } = cardInfo;
    this.props.changeCardInitialValues({
      cardType,
      holderName,
      cardNumber,
      expireDate,
      cvv,
    });

    this.setState({
      selectCard: cardInfo,
      isVisibleUpdateCardDlg: true,
    });
  }

  renderCards() {
    const { classes } = this.props;
    const { cards, _t, direction } = this.state;

    var positionStyle = direction === 'rtl' ? { left: 0 } : { right: 0 };

    if (cards && cards.length > 0) {
      var cardElems = [];
      cards.map((card) => {
        var cardNumber = card.cardNumber;
        var cardNumberElem = [];
        for (var i = 0, len = cardNumber.length; i < len; i += 4) {
          var partNum = cardNumber.substring(i, i + 4);
          cardNumberElem.push(
            <span className={classes.cardElemNumberPart}>{partNum}</span>
          );
        }

        var checkImage = card.active
          ? '/images/Checkbox-1.png'
          : '/images/Checkbox-2.png';

        var cardImage =
          card.cardType === 'mastercard'
            ? 'url(/images/Mastercard.png)'
            : card.cardType === 'visa'
            ? 'url(/images/Visa.png)'
            : 'url(/images/Knet.png)';

        cardElems.push(
          <div
            className={classes.cardElem}
            key={card._id}
            style={{ backgroundImage: cardImage }}
          >
            <div
              className={classes.cardElemLeft}
              onClick={this.onClickCardElem.bind(this, card)}
            >
              <div className={classes.cardElemNumber}>{cardNumberElem}</div>
              <div className={classes.cardElemHolder}>
                <span className={classes.cardElemLabel}>
                  {_t.profile.holder_name}
                </span>
                <span className={classes.cardElemValue}>{card.holderName}</span>
              </div>
              <div className={classes.cardElemExpire}>
                <span className={classes.cardElemLabel}>
                  {_t.profile.expire}
                </span>
                <span className={classes.cardElemValue}>{card.expireDate}</span>
              </div>
            </div>
            <div className={classes.cardElemRight} style={positionStyle}>
              <IconButton
                color="inherit"
                aria-label="active card"
                onClick={this.activeCard.bind(this, card._id)}
              >
                <img src={checkImage} alt="" />
              </IconButton>
            </div>
          </div>
        );

        return card;
      });
      return <div>{cardElems}</div>;
    } else {
      return <div className={classes.noCard}>{_t.profile.no_card}</div>;
    }
  }

  updateCards(cards) {
    this.setState({ cards: cards });
  }

  render() {
    const { classes } = this.props;
    const {
      isVisibleAddCardDlg,
      isVisibleUpdateCardDlg,
      selectCard,
      _t,
    } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div className={classes.topSec}>
            <Typography
              component="p"
              variant="h6"
              className={classes.pageTitle}
            >
              {_t.profile.cards}
            </Typography>
          </div>
          <div className={classes.mainSec}>
            <div className={classes.tabPanel}>{this.renderCards()}</div>
          </div>

          <Button
            className={classes.actionBtn}
            color="secondary"
            variant="contained"
            onClick={() => {
              this.props.changeCardInitialValues({
                cardType: '',
                holderName: '',
                cardNumber: '',
                expireDate: '',
                cvv: '',
              });
              this.setState({ isVisibleAddCardDlg: true });
            }}
          >
            {_t.profile.new_card}
          </Button>
          {isVisibleAddCardDlg && (
            <AddCardModal
              updateCards={this.updateCards}
              closeModal={this.closeAddCardDlg}
            />
          )}
          {isVisibleUpdateCardDlg && (
            <UpdateCardModal
              updateCards={this.updateCards}
              closeModal={this.closeUpdateCardDlg}
              selectCard={selectCard}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    me: getCurrentUser(state),
    authProvider: getSignedInWith(state),
    cards: getCardCards(state),
    activeCard: getCardActiveCard(state),
    lang: getLangLang(state),
  };
};

export default compose(
  connect(mapStateToProps, {
    updateProfile,
    getCards,
    deleteCard,
    updateActiveCard,
    getActiveCard,
    changeCardInitialValues,
  }),
  withStyles(styles)
)(Card);
