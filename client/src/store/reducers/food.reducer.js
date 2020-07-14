import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  foods: {},
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
      console.log('-- action.payload success : ', action.payload)
      return {
        ...state,
        processing: false,
        processed: true,
        foods: action.payload.data,
      };
    case actionTypes.GET_FOOD_SUCCESS:
      console.log('-- action.payload success : ', action.payload)
      return {
        ...state,
        processing: false,
        processed: true,
        food: action.payload.data,
      };
    case actionTypes.GET_FOODS_FAIL:
    case actionTypes.GET_FOOD_FAIL:
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

export default foodReducer;
