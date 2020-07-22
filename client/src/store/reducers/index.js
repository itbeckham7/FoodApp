import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import authReducer from './auth.reducer';
import categoryReducer from './category.reducer';
import foodReducer from './food.reducer';
import bagReducer from './bag.reducer';
import commentReducer from './comment.reducer';
import addressReducer from './address.reducer';
import cardReducer from './card.reducer';
import orderReducer from './order.reducer';
import branchReducer from './branch.reducer';
import settingReducer from './setting.reducer';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    form: formReducer,
    auth: authReducer,
    category: categoryReducer,
    branch: branchReducer,
    setting: settingReducer,
    food: foodReducer,
    bag: bagReducer,
    comment: commentReducer,
    address: addressReducer,
    card: cardReducer,
    order: orderReducer,
  });

export default createRootReducer;
