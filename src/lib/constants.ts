// const ScreenIndex = {
//   POST_LIST: 0, // 記事一覧
//   POST_DETAIL: 1, // 記事詳細
//   PROFILE: 2, // プロフィール
// } as const;

export const POST_LIST = 'POST_LIST';
export const POST_DETAIL = 'POST_DETAIL';
export const PROFILE = 'PROFILE';

const screenName = [POST_LIST, POST_DETAIL, PROFILE] as const;

export type ScreenName = typeof screenName[keyof typeof screenName]; // POST_LIST | POST_DETAIL | PROFILE etc..