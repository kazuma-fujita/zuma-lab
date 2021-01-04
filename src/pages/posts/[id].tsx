import { GetStaticPaths, GetStaticProps } from 'next';
import Layout, { PostItem } from '../../components/templates/Layout'
import { POST_DETAIL } from '../../lib/constants';
import { useGetAllPostIds, useGetPostData } from '../../state/PostDetail/hooks';

interface Props {
  item?: PostItem;
  errors?: string;
}

const Post: React.FC<Props> = ({ item, errors }) => (
  <Layout title="ZUMA Tech Note" screenName={POST_DETAIL} item={item} />
);

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = useGetAllPostIds();
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // const postData = await useGetPostData(params.id);
  const item = useGetPostData(params?.id);
  return {
    props: {
      item
    }
  }
}