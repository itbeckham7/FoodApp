import { createSelector } from 'reselect';

export const getFoodState = (state) => {console.log('-- state : ', state); return state.food};

export const getFoodFoods = createSelector(
  getFoodState,
  (food) => food.foods
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
