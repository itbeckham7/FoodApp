import * as actionTypes from './types';

export const getSetting = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_SETTING });
  return mernApi.get('/api/settings', {}).then(
    (response) => {
      var setting = response.data.setting;
      dispatch({ type: actionTypes.GET_SETTING_SUCCESS, payload: setting });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_SETTING_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};

