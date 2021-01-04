import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/posts');

export const useFetchPostList = () => {
  console.log('Here!!');
  // /posts　配下のファイル名を取得する
  const fileNames = fs.readdirSync(postsDirectory);
  console.log('fileNames:', fileNames);
  const allPostsData = fileNames.map(fileName => {
    // id を取得するためにファイル名から ".md" を削除する
    const id = fileName.replace(/\.md$/, '');

    // マークダウンファイルを文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName);
    const contents = fs.readFileSync(fullPath, 'utf8');

    // 投稿のメタデータ部分を解析するために gray-matter を使う
    // const matterResult = matter(contents);

    // データを id と合わせる
    return {
      id,
      // ...matterResult.data
      contents
    }
  })
  return allPostsData;
  // 投稿を日付でソートする
  // return allPostsData.sort((a, b) => {
  //   if (a.date < b.date) {
  //     return 1
  //   } else {
  //     return -1
  //   }
  // })
}