import { createSelector } from 'reselect';

export const getBranchState = (state) => {return state.branch};

export const getBranchBranches = createSelector(
  getBranchState,
  (branch) => branch.branches
);

export const getBranchError = createSelector(
  getBranchState,
  (branch) => branch.error
);

export const getBranchProcessing = createSelector(
  getBranchState,
  (branch) => {return branch.processing}
);

export const getBranchProcessed = createSelector(
  getBranchState,
  (branch) => branch.processed
);
