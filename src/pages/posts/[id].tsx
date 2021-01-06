import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../components/templates/Layout';
import { PostItem } from '../../interfaces/PostItem';
import { POST_DETAIL } from '../../lib/constants';
import { useGetAllPostIds, useGetPostData } from '../../state/PostDetail/hooks';

interface Props {
  item?: PostItem;
  errors?: string;
}

const Post: React.FC<Props> = ({ item, errors }) => (
  <Layout title='ZUMA Tech Note' screenName={POST_DETAIL} item={item} />
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
