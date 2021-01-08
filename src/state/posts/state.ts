import { PostItem } from 'interfaces/PostItem';

export interface PostsState {
  entities: Array<PostItem>;
  // loading?: boolean | null;
  // error?: string | null;
}

export const initialPostsState = {
  entities: [],
  // loading: null,
  // error: null,
};
