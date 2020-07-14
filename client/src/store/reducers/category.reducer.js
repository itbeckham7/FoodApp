import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  categories: {},
  processing: false,
  processed: false,
  error: null,
};

const categoryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.GET_CATEGORIES:
      return { ...state, processed: false, processing: true, error: null };
    case actionTypes.GET_CATEGORIES_SUCCESS:
      console.log('-- action.payload success : ', action.payload)
      return {
        ...state,
        processing: false,
        processed: true,
        categories: action.payload.data,
      };
    case actionTypes.GET_CATEGORIES_FAIL:
      console.log('-- action.payload fail : ', action.payload)
      return {
        ...state,
        processing: false,
        processed: true,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default categoryReducer;
