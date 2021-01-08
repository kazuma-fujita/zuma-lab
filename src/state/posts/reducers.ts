import { Reducer } from 'react';
import { ActionType, PostsAction } from './actions';
import { PostsState } from './state';

export const postsReducer: Reducer<PostsState, PostsAction> = (state: PostsState, action: PostsAction) => {
  switch (action.type) {
    case ActionType.FETCH_LIST:
      return {
        ...state,
        entities: action.fetchEntities,
      };
    // case ActionType.LOADING:
    //   return { ...state, loading: true };
    // case ActionType.ERROR:
    //   return { ...state, error: action.error, loading: false };
    default:
      throw new TypeError('Illegal type of action');
  }
};
