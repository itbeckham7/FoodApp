import { createSelector } from 'reselect';

export const getCategoryState = (state) => {return state.category};

export const getCategoryCategories = createSelector(
  getCategoryState,
  (category) => category.categories
);

export const getCategoryError = createSelector(
  getCategoryState,
  (category) => category.error
);

export const getCategoryProcessing = createSelector(
  getCategoryState,
  (category) => {return category.processing}
);

export const getCategoryProcessed = createSelector(
  getCategoryState,
  (category) => category.processed
);
