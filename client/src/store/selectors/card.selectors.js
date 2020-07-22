import { createSelector } from 'reselect';

export const getCardState = (state) => state.card;

export const getCardCards = createSelector(
  getCardState,
  (card) => card.cards
);

export const getCardCard = createSelector(
  getCardState,
  (card) => card.card
);

export const getCardActiveCard = createSelector(
  getCardState,
  (card) => card.activeCard
);

export const getCardError = createSelector(
  getCardState,
  (card) => card.error
);

export const getCardProcessing = createSelector(
  getCardState,
  (card) => card.processing
);

export const getCardProcessed = createSelector(
  getCardState,
  (card) => card.processed
);
