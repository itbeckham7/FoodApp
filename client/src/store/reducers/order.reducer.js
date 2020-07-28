import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  orders: null,
  order: null,
  processing: false,
  processed: false,
  error: null,
  orderInitialValue: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    cardType: '',
    holderName: '',
    cardNumber: '',
    expireDate: '',
    cvv: '',
    deliveryStyle: 'now',
    branchId: null,
    deliveryTime: '',
    price: 0,
    currency: ''
  },
};

const orderReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.GET_ORDERS:
    case actionTypes.GET_ORDER:
    case actionTypes.ADD_ORDER:
      return { ...state, processed: false, processing: true, error: null };
    case actionTypes.GET_ORDERS_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        orders: action.payload.orders,
      };
    case actionTypes.GET_ORDER_SUCCESS:
    case actionTypes.ADD_ORDER_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        order: action.payload.order,
      };
    case actionTypes.GET_ORDERS_FAIL:
    case actionTypes.GET_ORDER_FAIL:
    case actionTypes.ADD_ORDER_FAIL:
      return {
        ...state,
        processing: false,
        processed: true,
        error: action.payload,
      };
    case actionTypes.ORDER_INITIAL_VALUES:
      var orderInitialValue = state.orderInitialValue;
      var newOrderInitialValue = { ...orderInitialValue, ...action.payload };
      return {
        ...state,
        orderInitialValue: newOrderInitialValue,
      };
    default:
      return state;
  }
};

export default orderReducer;
