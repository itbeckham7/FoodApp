import * as actionTypes from './types';

export const getCards = (userId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_CARDS });
  return mernApi.get(`/api/cards/${userId}`, {}).then(
    (response) => {
      console.log('-- getCards response : ', response.data)
      var cards = response.data;
      dispatch({ type: actionTypes.GET_CARDS_SUCCESS, payload: cards });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_CARDS_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const getCard = (cardId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_CARD });
  return mernApi.get(`/api/cards/${cardId}`, {}).then(
    (response) => {
      var card = response.data;
      dispatch({ type: actionTypes.GET_CARD_SUCCESS, payload: card });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_CARD_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const getActiveCard = (userId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_ACTIVE_CARD });
  return mernApi.get(`/api/cards/getactive/${userId}`, {}).then(
    (response) => {
      var card = response.data;
      dispatch({ type: actionTypes.GET_ACTIVE_CARD_SUCCESS, payload: card });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_ACTIVE_CARD_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const addCard = (userId, formValue) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.ADD_CARD });
  console.log('-- addCard formValue : ', formValue)
  return mernApi.post(`/api/cards/add/${userId}`, formValue).then(
    (response) => {
      console.log('-- addCard response : ', response.data)
      var cards = response.data;
      dispatch({ type: actionTypes.ADD_CARD_SUCCESS, payload: cards });
    },
    (err) => {
      dispatch({
        type: actionTypes.ADD_CARD_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const updateCard = (cardId, formValue) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.UPDATE_CARD });
  return mernApi.put(`/api/cards/update/${cardId}`, formValue).then(
    (response) => {
      var cards = response.data;
      dispatch({ type: actionTypes.UPDATE_CARD_SUCCESS, payload: cards });
    },
    (err) => {
      dispatch({
        type: actionTypes.UPDATE_CARD_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const updateActiveCard = (userId, cardId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.UPDATE_ACTIVE_CARD });
  return mernApi.get(`/api/cards/updateactive/${userId}/${cardId}`, {}).then(
    (response) => {
      var cards = response.data;
      dispatch({ type: actionTypes.UPDATE_ACTIVE_CARD_SUCCESS, payload: cards });
    },
    (err) => {
      dispatch({
        type: actionTypes.UPDATE_ACTIVE_CARD_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};


export const deleteCard = (userId, cardId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.DELETE_CARD });
  return mernApi.delete(`/api/cards/delete/${userId}/${cardId}`, {}).then(
    (response) => {
      var cards = response.data;
      dispatch({ type: actionTypes.DELETE_CARD_SUCCESS, payload: cards });
    },
    (err) => {
      dispatch({
        type: actionTypes.DELETE_CARD_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};

export const changeCardInitialValues = (initialValues) => (dispatch, getState, { mernApi }) => {
  return dispatch({ type: actionTypes.CARD_INITIAL_VALUES, payload: initialValues });
};