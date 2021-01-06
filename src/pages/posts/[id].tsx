import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../components/templates/Layout';
import { PostItem } from '../../interfaces/PostItem';
import { useGetAllPostIds, useGetPostData } from '../../state/PostDetail/hooks';
import PostDetail from '../../components/templates/PostDetail';
import Sidebar from '../../components/organisms/Sidebar';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import { SITE_TITLE } from '../../lib/constants';

const sidebar = {
  title: 'Author',
  description: 'ZUMA a.k.a. Kazuma. Web/Mobile App開発。React/iOS/Android。Next/Amplify/Flutter勉強中。',
  archives: [{ title: 'March 2020', url: '#' }],
  social: [
    { name: 'GitHub', icon: GitHubIcon },
    { name: 'Twitter', icon: TwitterIcon },
  ],
};

interface Props {
  item?: PostItem;
  errors?: string;
}

const Post: React.FC<Props> = ({ item, errors }) => (
  <Layout title={`${item?.title} | ${SITE_TITLE}`}>
    <PostDetail item={item!}>
      <Sidebar
        title={sidebar.title}
        description={sidebar.description}
        archives={sidebar.archives}
        social={sidebar.social}
      />
    </PostDetail>
  </Layout>
);

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = useGetAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // const postData = await useGetPostData(params.id);
  const item = useGetPostData(params?.id as string);
  return {
    props: {
      item,
    },
  };
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
