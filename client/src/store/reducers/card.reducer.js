import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  cards: null,
  card: null,
  activeCard: null,
  processing: false,
  processed: false,
  error: null,
  cardInitialValues: {
    cardType: '',
    holderName: '',
    cardNumber: '',
    expireDate: '',
    cvv: '',
  }
};

const cardReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.GET_CARDS:
    case actionTypes.GET_CARD:
    case actionTypes.GET_ACTIVE_CARD:
    case actionTypes.ADD_CARD:
    case actionTypes.UPDATE_CARD:
    case actionTypes.DELETE_CARD:
    case actionTypes.UPDATE_ACTIVE_CARD:
      return { ...state, processed: false, processing: true, error: null };
    case actionTypes.GET_CARDS_SUCCESS:
    case actionTypes.ADD_CARD_SUCCESS:
    case actionTypes.UPDATE_CARD_SUCCESS:
    case actionTypes.UPDATE_ACTIVE_CARD_SUCCESS:
    case actionTypes.DELETE_CARD_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        cards: action.payload.cards,
      };
    case actionTypes.GET_CARD_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        card: action.payload.card,
      };
    case actionTypes.GET_ACTIVE_CARD_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        activeCard: action.payload.card,
      };
    case actionTypes.GET_CARDS_FAIL:
    case actionTypes.GET_CARD_FAIL:
    case actionTypes.ADD_CARD_FAIL:
    case actionTypes.UPDATE_CARD_FAIL:
    case actionTypes.DELETE_CARD_FAIL:
    case actionTypes.GET_ACTIVE_CARD_FAIL:
    case actionTypes.UPDATE_ACTIVE_CARD_FAIL:
      return {
        ...state,
        processing: false,
        processed: true,
        error: action.payload,
      };
    case actionTypes.CARD_INITIAL_VALUES:
      console.log('-- CARD_INITIAL_VALUES : ', action.payload)
      var cardInitialValues = state.cardInitialValues;
      var newCardInitialValues = {...cardInitialValues, ...action.payload}
      console.log('-- CARD_INITIAL_VALUES1 : ', newCardInitialValues)
      return {
        ...state,
        cardInitialValues: newCardInitialValues
      }
    default:
      return state;
  }
};

export default cardReducer;
