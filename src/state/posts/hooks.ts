import fs from 'fs';
import path from 'path';
import matter, { GrayMatterFile, Input } from 'gray-matter';
import { PostItem } from 'interfaces/PostItem';

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
  const matterResult = parseMarkdownFile(fileName);
  const contents = matterResult.content;
  const title = matterResult.data.title;
  const date = matterResult.data.date;
  const isPublished = matterResult.data.isPublished;
  const metaDescription = matterResult.data.metaDescription;
  // id を取得するためにファイル名から ".md" を削除する
  const id = fileName.replace(/\.md$/, '');
  // データを id と合わせる
  return {
    id,
    contents,
    title,
    date,
    isPublished,
    metaDescription,
  };
};

export const useFetchPostList = (): Array<PostItem> => {
  // posts　配下のファイル名を取得する
  const fileNames = fs.readdirSync(postsDirectory);
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

export const useGetAllPostIds = () => {
  // posts　配下のファイル名を取得する
  const fileNames = fs.readdirSync(postsDirectory);
  console.log('fileNames:', fileNames);
  return fileNames
    .map((fileName) => createPostItemByMarkdown(fileName))
    .filter((item) => item.isPublished) // isPublished=false記事を除外
    .map((item: PostItem) => {
      return {
        params: {
          id: item.id,
        },
      };
    });
};

export const useGetPostData = (id: string): PostItem => {
  return createPostItemByMarkdown(`${id}.md`);
};
