import fs from 'fs';
import path from 'path';
import matter, { GrayMatterFile, Input } from 'gray-matter';
import { PostItem } from 'interfaces/PostItem';
import { SITE_URL } from 'lib/constants';

const postsDirectory = path.join(process.cwd(), 'src/posts');

const parseMarkdownFile = (fileName: string): GrayMatterFile<Input> => {
  // マークダウンファイルのフルパスを文字列として読み取る
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  // 投稿のメタデータ部分を解析するために gray-matter を使う
  return matter(fileContents);
};

const createPostItemByMarkdown = (fileName: string): PostItem => {
  // fileNameからmarkdownを取得しメタデータを抽出する
  const matterResult: GrayMatterFile<Input> = parseMarkdownFile(fileName);
  const contents = matterResult.content;
  const data = matterResult.data as PostItem;
  const title = data.title;
  const date = data.date;
  const isPublished = data.isPublished;
  const metaDescription = data.metaDescription;
  const tags = data.tags;
  // id を取得するためにファイル名から ".md" を削除する
  const id = fileName.replace(/\.md$/, '');
  const url = `${SITE_URL}/posts/${id}`;
  // データを id と合わせる
  return {
    id,
    contents,
    title,
    url,
    date,
    isPublished,
    metaDescription,
    tags,
  };
};

export const useFetchPostList = (): Array<PostItem> => {
  // posts配下のファイル名を取得する
  const fileNames = fs.readdirSync(postsDirectory);
  // ファイル名配列からpostItemを作成してisPublishedを除外、かつ日付ソートをかける
  return fileNames
    .map((fileName) => createPostItemByMarkdown(fileName))
    .filter((item) => item.isPublished) // isPublished=false記事を除外
    .sort((a: PostItem, b: PostItem) => {
      // 投稿を日付でソート
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
};

export const useGetPostData = (id: string): PostItem => {
  return createPostItemByMarkdown(`${id}.md`);
};

export const useFetchTagList = (): Array<string> => {
  // 記事一覧取得
  const items: Array<PostItem> = useFetchPostList();
  // tagだけの配列を生成
  const tags: Array<string> = items.flatMap(({ tags }) => tags);
  // tagの重複を削除
  return [...new Set(tags)];
};

export const useFetchMonthList = (): Array<string> => {
  // 記事一覧取得
  const items: Array<PostItem> = useFetchPostList();
  // 記事更新月YYYY-MMだけの配列を生成
  const months: Array<string> = items.map(({ date }) => date.substring(0, 7));
  // YYYY-MMの重複を削除
  return [...new Set(months)];
};

export const useGetAllPostIds = (): Array<{ params: { id: string } }> => {
  // posts配下のファイル名を取得する
  const fileNames = fs.readdirSync(postsDirectory);
  // ファイル名配列からpostItemを作成してisPublishedを除外したid一覧を返却
  return fileNames
    .map((fileName) => createPostItemByMarkdown(fileName))
    .filter((item) => item.isPublished) // isPublished=false記事を除外
    .map((item: PostItem) => ({
      params: { id: item.id },
    }));
};

export const useGetAllTagIds = (): Array<{ params: { tag: string } }> => {
  // ユニークなtag名一覧取得
  const tags: Array<string> = useFetchTagList();
  // tag名をidとしてid配列を返却。paramsキーを付与しないとgetStaticPathsで認識されないので注意
  return tags.map((tag: string) => ({ params: { tag: tag } }));
};

export const useGetAllArchiveIds = (): Array<{ params: { month: string } }> => {
  // ユニークな記事更新月YYYY-mm一覧取得
  const months = useFetchMonthList();
  // getStaticPathsに認識させる為paramsキーを付与
  return months.map((month: string) => ({ params: { month: month } }));
};

export const useSearchTagList = (tag: string): Array<PostItem> => {
  // 記事一覧取得
  const items: Array<PostItem> = useFetchPostList();
  // tags配列にtag文字列検索をして一致した記事の配列を返却
  return items.filter(({ tags }) => tags.includes(tag));
};

export const useSearchMonthList = (month: string): Array<PostItem> => {
  // 記事一覧取得
  const items: Array<PostItem> = useFetchPostList();
  // 記事更新日YYYY-MM-ddに対して検索文字列 YYYY-MM 文字列前方一致した記事の配列を返却
  return items.filter(({ date }) => date.indexOf(month) !== -1);
};
