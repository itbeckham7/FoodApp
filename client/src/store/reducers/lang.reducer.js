import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  langs: null,
  lang: null,
  processing: false,
  processed: false,
  error: null,
};

const langReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.GET_LANGS:
      return { ...state, processed: false, processing: true, error: null };
    case actionTypes.GET_LANGS_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        langs: action.payload,
      };
    case actionTypes.GET_LANG_SUCCESS:
    case actionTypes.SET_LANG_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        lang: action.payload,
      };
    case actionTypes.GET_LANGS_FAIL:
      return {
        ...state,
        processing: false,
        processed: true,
        error: action.payload,
      };
    case actionTypes.CLEAR_LANG:
      return {
        ...state,
        processing: false,
        processed: true,
        lang: null,
      };
    default:
      return state;
  }
};

export default langReducer;
