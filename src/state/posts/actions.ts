import { PostItem } from 'interfaces/PostItem';

export enum ActionType {
  FETCH_LIST = 'ACTION_FETCH_LIST',
  // GET = 'ACTION_GET',
  // CREATE = 'ACTION_CREATE',
  // UPDATE = 'ACTION_UPDATE',
  // DELETE = 'ACTION_DELETE',
  // LOADING = 'ACTION_LOADING',
  // ERROR = 'ACTION_ERROR',
}

interface FetchListAction {
  type: ActionType.FETCH_LIST;
  fetchEntities: Array<PostItem>;
}

// interface GetAction {
//   type: ActionType.GET;
//   getEntity: PostItem;
// }

// interface CreateAction {
//   type: ActionType.CREATE;
//   addEntity: PostItem;
// }

// interface UpdateAction {
//   type: ActionType.UPDATE;
//   updateEntity: PostItem;
// }

// interface DeleteAction {
//   type: ActionType.DELETE;
//   deleteEntity: PostItem;
// }

// interface LoadingAction {
//   type: ActionType.LOADING;
// }

// interface ErrorAction {
//   type: ActionType.ERROR;
//   error: string;
// }

export type PostsAction = FetchListAction;
// | GetAction
// | CreateAction
// | UpdateAction
// | DeleteAction
// | LoadingAction
// | ErrorAction;
