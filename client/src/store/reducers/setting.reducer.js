import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  setting: null,
  processing: false,
  processed: false,
  error: null,
};

const settingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.GET_SETTING:
      return { ...state, processed: false, processing: true, error: null };
    case actionTypes.GET_SETTING_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        setting: action.payload,
      };
    case actionTypes.GET_SETTING_FAIL:
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

export default settingReducer;
