import { createSelector } from 'reselect';

export const getBagState = (state) => state.bag;

export const getBagBags = createSelector(
  getBagState,
  (bag) => bag.bags
);

export const getBagCheckOutBags = createSelector(
  getBagState,
  (bag) => bag.checkOutBags
);

export const getBagBag = createSelector(
  getBagState,
  (bag) => bag.bag
);

export const getBagError = createSelector(
  getBagState,
  (bag) => bag.error
);

export const getBagProcessing = createSelector(
  getBagState,
  (bag) => bag.processing
);

export const getBagProcessed = createSelector(
  getBagState,
  (bag) => bag.processed
);
