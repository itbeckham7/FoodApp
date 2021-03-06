import * as actionTypes from './types';

export const getBags = (userId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_BAGS });

  const bags = JSON.parse(getBagsFromStorage(userId));
  if (bags) {
    return mernApi.post('/api/bags/detailBags', { bags }).then(
      (response) => {
        var bags = response.data.bags;
        var newBags = [];
        bags.map((bag) => {
          newBags.push({
            foodId: bag.foodId,
            price: bag.price,
            currency: bag.currency,
            qty: bag.qty,
            note: bag.note,
            bagExtras: bag.bagExtras,
          });
          return bag;
        });
        setBagsToStorage(userId, newBags);
        dispatch({ type: actionTypes.GET_BAGS_SUCCESS, payload: bags });
      },
      (err) => {
        dispatch({
          type: actionTypes.GET_BAGS_FAIL,
          payload: err.response.data.error.message,
        });
      }
    );
  } else {
    return Promise.resolve().then(() => {
      dispatch({
        type: actionTypes.GET_BAGS_FAIL,
        payload: 'There are no bags',
      });
    });
  }
};

export const getBag = (userId, bagId) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GET_BAG });

  return Promise.resolve().then(() => {
    const bags = JSON.parse(getBagsFromStorage(userId));
    if (bags) {
      var bag = bags.filter((bag) => bag._id === bagId);
      if (bag && bag[0]) {
        dispatch({ type: actionTypes.GET_BAG_SUCCESS, payload: bag[0] });
      }
    }

    dispatch({
      type: actionTypes.GET_BAG_FAIL,
      payload: 'There are no bag',
    });
  });
};

export const addToBag = (userId, foodId, price, currency, qty, nt, bagExtras) => (
  dispatch,
  getState,
  { mernApi }
) => {
  dispatch({ type: actionTypes.ADD_TO_BAG });

  var note = nt ? nt : '';
  var bags = JSON.parse(getBagsFromStorage(userId));
  if (bags) {
    var isFind = false;
    for (var i = 0; i < bags.length; i++) {
      if (bags[i].foodId === foodId) {
        isFind = true;
        bags[i].price = price;
        bags[i].currency = currency;
        bags[i].qty = qty;
        bags[i].note = note;
        bags[i].bagExtras = bagExtras;
        break;
      }
    }

    if (!isFind) {
      bags.push({ foodId, qty, price, currency, note, bagExtras });
    }
  } else {
    bags = [{ foodId, qty, price, currency, note, bagExtras }];
  }

  if (bags) {
    return mernApi.post('/api/bags/detailBags', { bags }).then(
      (response) => {
        var bags = response.data.bags;
        var newBags = [];
        bags.map((bag) => {
          newBags.push({
            foodId: bag.foodId,
            price: bag.price,
            currency: bag.currency,
            qty: bag.qty,
            note: bag.note,
            bagExtras: bag.bagExtras,
          });
          return bag
        });
        
        setBagsToStorage(userId, newBags);
        dispatch({ type: actionTypes.ADD_TO_BAG_SUCCESS, payload: bags });
      },
      (err) => {
        dispatch({
          type: actionTypes.ADD_TO_BAG_FAIL,
          payload: err.response.data.error.message,
        });
      }
    );
  } else {
    return Promise.resolve().then(() => {
      dispatch({
        type: actionTypes.ADD_TO_BAG_FAIL,
        payload: 'There are no bags',
      });
    });
  }
};

export const deleteBag = (userId, foodId) => (
  dispatch,
  getState,
  { mernApi }
) => {
  dispatch({ type: actionTypes.DELETE_BAG });

  var bags = JSON.parse(getBagsFromStorage(userId));
  if (bags) {
    for (var i = 0; i < bags.length; i++) {
      if (bags[i].foodId === foodId) {
        bags.splice(i, 1);
        break;
      }
    }

    return mernApi.post('/api/bags/detailBags', { bags }).then(
      (response) => {
        var bags = response.data.bags;
        var newBags = [];
        bags.map((bag) => {
          newBags.push({
            foodId: bag.foodId,
            price: bag.price,
            currency: bag.currency,
            qty: bag.qty,
            note: bag.note,
            bagExtras: bag.bagExtras,
          });
          return bag
        });
        setBagsToStorage(userId, newBags);
        dispatch({ type: actionTypes.DELETE_BAG_SUCCESS, payload: bags });
      },
      (err) => {
        dispatch({
          type: actionTypes.DELETE_BAG_FAIL,
          payload: err.response.data.error.message,
        });
      }
    );
  } else {
    dispatch({
      type: actionTypes.DELETE_BAG_FAIL,
      payload: "Can't find bag",
    });
  }
};

export const clearBag = (userId) => (dispatch, getState, { mernApi }) => {
  clearBagsStorage(userId);
  dispatch({ type: actionTypes.CLEAR_BAG });
};

const getBagsFromStorage = (userId) => {
  return localStorage.getItem('foodAppBags' + userId);
};

const setBagsToStorage = (userId, bags) => {
  localStorage.setItem('foodAppBags' + userId, JSON.stringify(bags));
};

const clearBagsStorage = (userId) => {
  localStorage.removeItem('foodAppBags' + userId);
};
