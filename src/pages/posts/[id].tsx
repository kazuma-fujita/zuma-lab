import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from 'components/templates/Layout';
import { PostItem } from 'interfaces/PostItem';
import { useFetchMonthList, useFetchPostList, useGetAllPostIds, useGetPostData } from 'state/posts/hooks';
import PostDetail from 'components/templates/PostDetail';
import Sidebar from 'components/organisms/Sidebar';
import { SITE_TITLE } from 'lib/constants';
import { useFetchSNSList } from 'state/SNS/hooks';
import { useFetchAvatarItem } from 'state/Avatar/hooks';
import { useFetchTagList } from 'state/posts/hooks';
import { SidebarProps } from 'interfaces/SidebarProps';

interface Props extends SidebarProps {
  item: PostItem;
}

const Post: React.FC<Props> = ({ item, ...rest }) => (
  <Layout title={`${item.title} | ${SITE_TITLE}`} metaDescription={item.metaDescription}>
    <PostDetail item={item}>
      <Sidebar {...rest} />
    </PostDetail>
  </Layout>
);

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = useGetAllPostIds();
  return Promise.resolve({
    paths,
    fallback: false,
  });
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const item = useGetPostData(params?.id as string);
  const avatar = useFetchAvatarItem();
  const socials = useFetchSNSList();
  const items = useFetchPostList();
  const tags = useFetchTagList();
  const archives = useFetchMonthList();

  return Promise.resolve({
    props: {
      item,
      avatar,
      socials,
      items,
      tags,
      archives,
    },
  });
};

// Error sample
// type Props = {
//   item?: User;
//   errors?: string;
// };

// const StaticPropsDetail = ({ item, errors }: Props) => {
//   if (errors) {
//     return (
//       <Layout title='Error | Next.js + TypeScript Example'>
//         <p>
//           <span style={{ color: 'red' }}>Error:</span> {errors}
//         </p>
//       </Layout>
//     );
//   }

//   return (
//     <Layout title={`${item ? item.name : 'User Detail'} | Next.js + TypeScript Example`}>
//       {item && <ListDetail item={item} />}
//     </Layout>
//   );
// };

// export default StaticPropsDetail;

// export const getStaticPaths: GetStaticPaths = async () => {
//   const paths = sampleUserData.map((user) => ({
//     params: { id: user.id.toString() },
//   }));

//   return { paths, fallback: false };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   try {
//     const id = params?.id;
//     const item = sampleUserData.find((data) => data.id === Number(id));
//     return { props: { item } };
//   } catch (err) {
//     return { props: { errors: err.message } };
//   }
// };
