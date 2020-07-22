import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  branches: null,
  processing: false,
  processed: false,
  error: null,
};

const branchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.GET_BRANCHES:
      return { ...state, processed: false, processing: true, error: null };
    case actionTypes.GET_BRANCHES_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        branches: action.payload.branches,
      };
    case actionTypes.GET_BRANCHES_FAIL:
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

export default branchReducer;
