import { createSelector } from 'reselect';

export const getFoodState = (state) => state.food;

export const getFoodFoods = createSelector(
  getFoodState,
  (food) => food.foods
);

export const getFoodSliderFoods = createSelector(
  getFoodState,
  (food) => food.sliderfoods
);

export const getFoodFood = createSelector(
  getFoodState,
  (food) => food.food
);

export const getFoodError = createSelector(
  getFoodState,
  (food) => food.error
);

export const getFoodProcessing = createSelector(
  getFoodState,
  (food) => food.processing
);

export const getFoodProcessed = createSelector(
  getFoodState,
  (food) => food.processed
);
