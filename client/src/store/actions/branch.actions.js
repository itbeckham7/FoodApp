import * as actionTypes from './types';

export const getBranches = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_BRANCHES });
  return mernApi.get('/api/branches', {}).then(
    (response) => {
      var branches = response.data;
      dispatch({ type: actionTypes.GET_BRANCHES_SUCCESS, payload: branches });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_BRANCHES_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};

