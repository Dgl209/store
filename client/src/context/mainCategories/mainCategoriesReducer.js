import { FETCH, SET_ERROR, SHOW_LOADER } from '../types';

const handlers = {
  [SHOW_LOADER]: (state) => ({ ...state, loading: true }),
  [FETCH]: (state, { payload }) => ({ ...state, categories: payload, loading: false }),
  [SET_ERROR]: (state, { payload }) => ({ ...state, error: payload }),
  DEFAULT: (state) => state,
};

export const MainCategoriesReducer = (state, action) => {
  const handle = handlers[action.type] || handlers.DEFAULT;
  return handle(state, action);
};
