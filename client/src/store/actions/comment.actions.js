import * as actionTypes from './types';

export const getComments = (foodId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_COMMENTS });
  return mernApi.get(`/api/comments/${foodId}`, {}).then(
    (response) => {
      var comments = response.data;
      dispatch({ type: actionTypes.GET_COMMENTS_SUCCESS, payload: comments });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_COMMENTS_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const getComment = (commentId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_COMMENT });
  return mernApi.get(`/api/comments/${commentId}`, {}).then(
    (response) => {
      var comment = response.data;
      dispatch({ type: actionTypes.GET_COMMENT_SUCCESS, payload: comment });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_COMMENT_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const addComment = (userId, foodId, formValue) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.ADD_COMMENT });
  return mernApi.post(`/api/comments/add/${userId}/${foodId}`, formValue).then(
    (response) => {
      var comments = response.data;
      dispatch({ type: actionTypes.ADD_COMMENT_SUCCESS, payload: comments });
    },
    (err) => {
      dispatch({
        type: actionTypes.ADD_COMMENT_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};

