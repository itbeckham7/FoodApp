import { createSelector } from 'reselect';

export const getLangState = (state) => state.lang;

export const getLangLangs = createSelector(
  getLangState,
  (lang) => lang.langs
);

export const getLangLang = createSelector(
  getLangState,
  (lang) => lang.lang
);

export const getLangError = createSelector(
  getLangState,
  (lang) => lang.error
);

export const getLangProcessing = createSelector(
  getLangState,
  (lang) => lang.processing
);

export const getLangProcessed = createSelector(
  getLangState,
  (lang) => lang.processed
);
