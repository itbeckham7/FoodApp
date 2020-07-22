import * as actionTypes from './types';

export const getAddresses = (userId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_ADDRESSES });
  return mernApi.get(`/api/addresses/${userId}`, {}).then(
    (response) => {
      console.log('-- getAddresses response : ', response.data)
      var addresses = response.data;
      dispatch({ type: actionTypes.GET_ADDRESSES_SUCCESS, payload: addresses });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_ADDRESSES_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const getAddress = (addressId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_ADDRESS });
  return mernApi.get(`/api/addresses/${addressId}`, {}).then(
    (response) => {
      var address = response.data;
      dispatch({ type: actionTypes.GET_ADDRESS_SUCCESS, payload: address });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_ADDRESS_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const getActiveAddress = (userId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_ACTIVE_ADDRESS });
  return mernApi.get(`/api/addresses/getactive/${userId}`, {}).then(
    (response) => {
      var address = response.data;
      dispatch({ type: actionTypes.GET_ACTIVE_ADDRESS_SUCCESS, payload: address });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_ACTIVE_ADDRESS_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const addAddress = (userId, formValue) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.ADD_ADDRESS });
  console.log('-- addAddress formValue : ', formValue)
  return mernApi.post(`/api/addresses/add/${userId}`, formValue).then(
    (response) => {
      console.log('-- addAddress response : ', response.data)
      var addresses = response.data;
      dispatch({ type: actionTypes.ADD_ADDRESS_SUCCESS, payload: addresses });
    },
    (err) => {
      dispatch({
        type: actionTypes.ADD_ADDRESS_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const updateAddress = (addressId, formValue) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.UPDATE_ADDRESS });
  return mernApi.put(`/api/addresses/update/${addressId}`, formValue).then(
    (response) => {
      var addresses = response.data;
      dispatch({ type: actionTypes.UPDATE_ADDRESS_SUCCESS, payload: addresses });
    },
    (err) => {
      dispatch({
        type: actionTypes.UPDATE_ADDRESS_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const updateActiveAddress = (userId, addressId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.UPDATE_ACTIVE_ADDRESS });
  return mernApi.get(`/api/addresses/updateactive/${userId}/${addressId}`, {}).then(
    (response) => {
      var addresses = response.data;
      dispatch({ type: actionTypes.UPDATE_ACTIVE_ADDRESS_SUCCESS, payload: addresses });
    },
    (err) => {
      dispatch({
        type: actionTypes.UPDATE_ACTIVE_ADDRESS_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const deleteAddress = (userId, addressId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.DELETE_ADDRESS });
  return mernApi.delete(`/api/addresses/delete/${userId}/${addressId}`, {}).then(
    (response) => {
      var addresses = response.data;
      dispatch({ type: actionTypes.DELETE_ADDRESS_SUCCESS, payload: addresses });
    },
    (err) => {
      dispatch({
        type: actionTypes.DELETE_ADDRESS_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};

export const changeAddressInitialValues = (initialValues) => (dispatch, getState, { mernApi }) => {
  return dispatch({ type: actionTypes.ADDRESS_INITIAL_VALUES, payload: initialValues });
};