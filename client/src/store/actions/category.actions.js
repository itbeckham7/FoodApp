import * as actionTypes from './types';

export const getCategories = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_CATEGORIES });
  return mernApi.get('/api/categories', {}).then(
    (response) => {
      var categories = response.data;
      dispatch({ type: actionTypes.GET_CATEGORIES_SUCCESS, payload: categories });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_CATEGORIES_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};

