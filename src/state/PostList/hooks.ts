import fs from 'fs';
import path from 'path';
import matter, { GrayMatterFile, Input } from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';
import { PostItem } from 'interfaces/PostItem';

const postsDirectory = path.join(process.cwd(), 'src/posts');

export const useFetchPostList = (): Array<PostItem> => {
  // /posts　配下のファイル名を取得する
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .map((fileName) => {
      // id を取得するためにファイル名から ".md" を削除する
      const id = fileName.replace(/\.md$/, '');

      // マークダウンファイルを文字列として読み取る
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // 投稿のメタデータ部分を解析するために gray-matter を使う
      const matterResult: GrayMatterFile<Input> = matter(fileContents);
      const contents = matterResult.content;
      const title = matterResult.data.title;
      const date = matterResult.data.date;
      const isPublished = matterResult.data.isPublished;

      // データを id と合わせる
      return {
        id,
        contents,
        title,
        date,
        isPublished,
      };
    })
    .filter((item) => item.isPublished); // isPublished=false記事を除外

  // 投稿を日付でソートする
  return allPostsData.sort((a: PostItem, b: PostItem) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
};
