import { createSelector } from 'reselect';

export const getSettingState = (state) => state.setting;

export const getSettingSetting = createSelector(
  getSettingState,
  (setting) => setting.setting
);

export const getSettingError = createSelector(
  getSettingState,
  (setting) => setting.error
);

export const getSettingProcessing = createSelector(
  getSettingState,
  (setting) => setting.processing
);

export const getSettingProcessed = createSelector(
  getSettingState,
  (setting) => setting.processed
);
