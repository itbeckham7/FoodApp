import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import authReducer from './auth.reducer';
import categoryReducer from './category.reducer';
import foodReducer from './food.reducer';
import bagReducer from './bag.reducer';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    form: formReducer,
    auth: authReducer,
    category: categoryReducer,
    food: foodReducer,
    bag: bagReducer,
  });

export default createRootReducer;
