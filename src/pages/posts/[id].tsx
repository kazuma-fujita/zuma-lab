import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from 'components/templates/Layout';
import { PostItem } from 'interfaces/PostItem';
import { useFetchPostList, useGetAllPostIds, useGetPostData } from 'state/posts/hooks';
import PostDetail from 'components/templates/PostDetail';
import Sidebar from 'components/organisms/Sidebar';
import { SITE_TITLE } from 'lib/constants';
import { useFetchSNSList } from 'state/SNS/hooks';
import { SNSItem } from 'interfaces/SNSItem';
import { AvatarItem } from 'interfaces/AvatarItem';
import { useFetchAvatarItem } from 'state/Avatar/hooks';

// const sidebar = {
//   archives: [{ title: 'March 2020', url: '#' }],
// };

interface Props {
  item: PostItem;
  avatar: AvatarItem;
  socials: Array<SNSItem>;
  items: Array<PostItem>;
  // item?: PostItem;
  // errors?: string;
}

// const Post: React.FC<Props> = ({ avatar, socials, item, errors }) => (
const Post: React.FC<Props> = ({ item, ...rest }) => (
  <Layout title={`${item.title} | ${SITE_TITLE}`} metaDescription={item.metaDescription}>
    <PostDetail item={item}>
      {/* <Sidebar title={sidebar.title} description={sidebar.description} archives={sidebar.archives} socials={socials} /> */}
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
  // const postData = await useGetPostData(params.id);
  const avatar = useFetchAvatarItem();
  const socials = useFetchSNSList();
  const items = useFetchPostList();
  const item = useGetPostData(params?.id as string);
  return Promise.resolve({
    props: {
      item,
      avatar,
      socials,
      items,
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
