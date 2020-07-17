import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  comments: null,
  comment: null,
  processing: false,
  processed: false,
  error: null,
};

const commentReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.GET_COMMENTS:
    case actionTypes.GET_COMMENT:
    case actionTypes.ADD_COMMENT:
      return { ...state, processed: false, processing: true, error: null };
    case actionTypes.GET_COMMENTS_SUCCESS:
    case actionTypes.ADD_COMMENT_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        comments: action.payload.comments,
      };
    case actionTypes.GET_COMMENT_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        comment: action.payload.comment,
      };
    case actionTypes.GET_COMMENTS_FAIL:
    case actionTypes.GET_COMMENT_FAIL:
    case actionTypes.ADD_COMMENT_FAIL:
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

export default commentReducer;
