import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostItem } from 'interfaces/PostItem';

const postsDirectory = path.join(process.cwd(), 'src/posts');

// TODO: markdownファイルではなく、最初にfetchしたlistからidの配列生成する
// listの情報をstateで持つこと
export const useGetAllPostIds = () => {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
};

// export const useGetPostData = async (id: string) => {
export const useGetPostData = (id: string): PostItem => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  // 投稿のメタデータ部分を解析するために gray-matter を使う
  const matterResult = matter(fileContents);
  const contents = matterResult.content;
  const title = matterResult.data.title;
  const date = matterResult.data.date;
  const isPublished = matterResult.data.isPublished;
  const metaDescription = matterResult.data.metaDescription;
  // マークダウンを HTML 文字列に変換するために remark を使う
  // const processedContent = await remark()
  //   .use(html)
  //   // .process(matterResult.content)
  //   .process(contents);
  // const contentHtml = processedContent.toString();

  // データを id および contentHtml と組み合わせる
  return {
    id,
    contents,
    title,
    date,
    isPublished,
    metaDescription,
    // contentHtml,
    // ...matterResult.data
  };
};
