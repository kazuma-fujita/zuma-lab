import React, { createContext, Dispatch, useContext } from 'react';
import { PostsAction } from './actions';
import { PostsState } from './state';

interface Props {
  state: PostsState;
  dispatch: Dispatch<PostsAction>;
}

const PostsContext = createContext({} as Props);

export const usePostsContext = () => useContext(PostsContext);

export const PostsContextProvider: React.FC<Props> = ({ state, dispatch, ...rest }) => (
  <PostsContext.Provider value={{ state, dispatch }} {...rest} />
);
