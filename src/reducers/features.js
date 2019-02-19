import { FETCH_FEATURES } from '../constants/actionTypes';

export default (state = { active: [] }, action) => {
  switch (action.type) {
    case FETCH_FEATURES:
    if (!action.payload.errors) {
      return {
        ...state,
        active: action.payload.features
      };
    }
    return { ...state }
    default:
      return state;
  }
};
