import { createSelector } from 'reselect';

export const getCommentState = (state) => state.comment;

export const getCommentComments = createSelector(
  getCommentState,
  (comment) => comment.comments
);

export const getCommentComment = createSelector(
  getCommentState,
  (comment) => comment.comment
);

export const getCommentError = createSelector(
  getCommentState,
  (comment) => comment.error
);

export const getCommentProcessing = createSelector(
  getCommentState,
  (comment) => comment.processing
);

export const getCommentProcessed = createSelector(
  getCommentState,
  (comment) => comment.processed
);
