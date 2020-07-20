import { createSelector } from 'reselect';

export const getAddressState = (state) => state.address;

export const getAddressAddresses = createSelector(
  getAddressState,
  (address) => address.addresses
);

export const getAddressAddress = createSelector(
  getAddressState,
  (address) => address.address
);

export const getAddressActiveAddress = createSelector(
  getAddressState,
  (address) => address.activeAddress
);

export const getAddressError = createSelector(
  getAddressState,
  (address) => address.error
);

export const getAddressProcessing = createSelector(
  getAddressState,
  (address) => address.processing
);

export const getAddressProcessed = createSelector(
  getAddressState,
  (address) => address.processed
);
