import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  bags: {},
  processing: false,
  processed: false,
  error: null,
};

const bagReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.GET_BAGS:
    case actionTypes.GET_BAG:
    case actionTypes.ADD_TO_BAG:
    case actionTypes.DELETE_BAG:
      return { ...state, processed: false, processing: true, error: null };
    case actionTypes.GET_BAGS_SUCCESS:
    case actionTypes.ADD_TO_BAG_SUCCESS:
    case actionTypes.DELETE_BAG_SUCCESS:
      console.log('-- action.payload success : ', state, action.type, action.payload);
      return {
        ...state,
        processing: false,
        processed: true,
        bags: action.payload,
      };
    case actionTypes.GET_BAG_SUCCESS:
      console.log('-- action.payload success : ', action.type, action.payload);
      return {
        ...state,
        processing: false,
        processed: true,
        bag: action.payload,
      };
    case actionTypes.SET_CHECKOUT_BAGS_SUCCESS:
    case actionTypes.GET_CHECKOUT_BAGS_SUCCESS:
      console.log('-- action.payload success : ', action.type, action.payload);
      return {
        ...state,
        processing: false,
        processed: true,
        checkOutBags: action.payload,
      };
    case actionTypes.GET_BAGS_FAIL:
    case actionTypes.GET_BAG_FAIL:
    case actionTypes.ADD_TO_BAG_FAIL:
    case actionTypes.DELETE_BAG_FAIL:
      console.log('-- action.payload fail : ', action.type, action.payload);
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

export default bagReducer;
