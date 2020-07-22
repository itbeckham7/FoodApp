import { createSelector } from 'reselect';

export const getOrderState = (state) => state.order;

export const getOrderOrders = createSelector(
  getOrderState,
  (order) => order.orders
);

export const getOrderOrder = createSelector(
  getOrderState,
  (order) => order.order
);

export const getOrderInitialValue = createSelector(
  getOrderState,
  (order) => order.orderInitialValue
);

export const getOrderError = createSelector(
  getOrderState,
  (order) => order.error
);

export const getOrderProcessing = createSelector(
  getOrderState,
  (order) => order.processing
);

export const getOrderProcessed = createSelector(
  getOrderState,
  (order) => order.processed
);
