import * as actionTypes from './types';

export const getOrders = (userId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_ORDERS });
  return mernApi.get(`/api/orders/${userId}`, {}).then(
    (response) => {
      var orders = response.data;
      dispatch({ type: actionTypes.GET_ORDERS_SUCCESS, payload: orders });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_ORDERS_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const getOrder = (orderId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_ORDER });
  return mernApi.get(`/api/orders/order/${orderId}`, {}).then(
    (response) => {
      var order = response.data;
      dispatch({ type: actionTypes.GET_ORDER_SUCCESS, payload: order });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_ORDER_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const addOrder = (userId, orderValue, bags) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.ADD_ORDER });
  var order = {userId, ...orderValue, bags, status: 'pending'}
  return mernApi.post(`/api/orders/add/`, order).then(
    (response) => {
      var newOrder = response.data;
      dispatch({ type: actionTypes.ADD_ORDER_SUCCESS, payload: newOrder });
    },
    (err) => {
      dispatch({
        type: actionTypes.ADD_ORDER_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const changeOrderInitialValue = (initialValues) => (dispatch, getState, { mernApi }) => {
  return dispatch({ type: actionTypes.ORDER_INITIAL_VALUES, payload: initialValues });
};