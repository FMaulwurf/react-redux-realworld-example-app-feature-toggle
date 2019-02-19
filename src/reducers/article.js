import {
  ARTICLE_PAGE_LOADED,
  ARTICLE_PAGE_UNLOADED,
  ADD_COMMENT,
  DELETE_COMMENT,
  ARTICLE_STATISTICS_PAGE_LOADED,
  ADD_SHARE,
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case ARTICLE_STATISTICS_PAGE_LOADED:
      return {
        ...state,
        article: action.payload[0].article,
        shares: action.payload[1].shares
      };
    case ARTICLE_PAGE_LOADED:
      return {
        ...state,
        article: action.payload[0].article,
        comments: action.payload[1].comments
      };
    case ARTICLE_PAGE_UNLOADED:
      return {};
    case ADD_COMMENT:
      return {
        ...state,
        commentErrors: action.error ? action.payload.errors : null,
        comments: action.error ?
          null :
          (state.comments || []).concat([action.payload.comment])
      };
    case DELETE_COMMENT:
      const commentId = action.commentId
      return {
        ...state,
        comments: state.comments.filter(comment => comment.id !== commentId)
      };
    case ADD_SHARE:
      return {
        ...state,
        cshareErrors: action.error ? action.payload.errors : null,
        shares: action.error ?
          null :
          (state.shares || []).concat([action.payload.share])
      };
    default:
      return state;
  }
};
