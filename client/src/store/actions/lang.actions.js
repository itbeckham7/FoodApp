import * as actionTypes from './types';

export const getLangs = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_LANGS });

  return mernApi.get('/api/languages', {}).then(
    (response) => {
      var langs = response.data.langs;
      dispatch({ type: actionTypes.GET_LANGS_SUCCESS, payload: langs });
    },
    (err) => {
      dispatch({
        type: actionTypes.GET_LANGS_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};

export const getLang = () => (dispatch, getState, { mernApi }) => {
  const lang = JSON.parse(getLangFromStorage());
  dispatch({ type: actionTypes.GET_LANG_SUCCESS, payload: lang });
};

export const setLang = (lang) => (dispatch, getState, { mernApi }) => {
  setLangToStorage(JSON.stringify(lang));
  dispatch({ type: actionTypes.SET_LANG_SUCCESS, payload: lang });
};

export const clearLang = () => (dispatch, getState, { mernApi }) => {
  clearLangStorage();
  dispatch({ type: actionTypes.CLEAR_LANG });
};

const getLangFromStorage = () => {
  return localStorage.getItem('foodAppLang');
};

const setLangToStorage = (lang) => {
  localStorage.setItem('foodAppLang', lang);
};

const clearLangStorage = () => {
  localStorage.removeItem('foodAppLang');
};
