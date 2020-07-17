import * as actionTypes from './types';

export const getFoods = (categoryId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_FOODS });
  return mernApi.get(`/api/foods/category/${categoryId}`, {}).then(
    (response) => {
      var foods = response.data;
      dispatch({ type: actionTypes.GET_FOODS_SUCCESS, payload: foods });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_FOODS_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const getFood = (foodId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_FOOD });
  return mernApi.get(`/api/foods/${foodId}`, {}).then(
    (response) => {
      var food = response.data;
      dispatch({ type: actionTypes.GET_FOOD_SUCCESS, payload: food });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_FOOD_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};
