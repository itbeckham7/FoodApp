import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  foods: null,
  food: null,
  processing: false,
  processed: false,
  error: null,
};

const foodReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.GET_FOODS:
    case actionTypes.GET_FOOD:
      return { ...state, processed: false, processing: true, error: null };
    case actionTypes.GET_FOODS_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        foods: action.payload.data,
      };
    case actionTypes.GET_FOOD_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        food: action.payload.data,
      };
    case actionTypes.GET_FOODS_FAIL:
    case actionTypes.GET_FOOD_FAIL:
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

export default foodReducer;
