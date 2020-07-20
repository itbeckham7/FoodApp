import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  addresses: null,
  address: null,
  activeAddress: null,
  processing: false,
  processed: false,
  error: null,
  addressInitialValues: {
    addressName: '',
    countryId: '',
    stateId: '',
    cityId: '',
    address: '',
  }
};

const addressReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.GET_ADDRESSES:
    case actionTypes.GET_ADDRESS:
    case actionTypes.GET_ACTIVE_ADDRESS:
    case actionTypes.ADD_ADDRESS:
    case actionTypes.UPDATE_ADDRESS:
    case actionTypes.DELETE_ADDRESS:
    case actionTypes.UPDATE_ACTIVE_ADDRESS:
      return { ...state, processed: false, processing: true, error: null };
    case actionTypes.GET_ADDRESSES_SUCCESS:
    case actionTypes.ADD_ADDRESS_SUCCESS:
    case actionTypes.UPDATE_ADDRESS_SUCCESS:
    case actionTypes.UPDATE_ACTIVE_ADDRESS_SUCCESS:
    case actionTypes.DELETE_ADDRESS_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        addresses: action.payload.addresses,
      };
    case actionTypes.GET_ADDRESS_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        address: action.payload.address,
      };
    case actionTypes.GET_ACTIVE_ADDRESS_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        activeAddress: action.payload.address,
      };
    case actionTypes.GET_ADDRESSES_FAIL:
    case actionTypes.GET_ADDRESS_FAIL:
    case actionTypes.ADD_ADDRESS_FAIL:
    case actionTypes.UPDATE_ADDRESS_FAIL:
    case actionTypes.DELETE_ADDRESS_FAIL:
    case actionTypes.GET_ACTIVE_ADDRESS_FAIL:
    case actionTypes.UPDATE_ACTIVE_ADDRESS_FAIL:
      return {
        ...state,
        processing: false,
        processed: true,
        error: action.payload,
      };
    case actionTypes.ADDRESS_INITIAL_VALUES:
      console.log('-- ADDRESS_INITIAL_VALUES : ', action.payload)
      var addressInitialValues = state.addressInitialValues;
      var newAddressInitialValues = {...addressInitialValues, ...action.payload}
      console.log('-- ADDRESS_INITIAL_VALUES1 : ', newAddressInitialValues)
      return {
        ...state,
        addressInitialValues: newAddressInitialValues
      }
    default:
      return state;
  }
};

export default addressReducer;
