import { GetStaticProps } from 'next';
import Layout, { PostItem } from '../components/templates/Layout'
import { POST_LIST } from '../lib/constants';
import { useFetchPostList } from '../state/PostList/hooks';

interface Props {
  items: Array<PostItem>;
}

const IndexPage: React.FC<Props> = ({ items }) => (
  <Layout title="ZUMA Tech Note" screenName={POST_LIST} items={items} />
);

export default IndexPage;

export const getStaticProps: GetStaticProps = async () => {
  const items = useFetchPostList();
  return {
    props: {
      items
    }
  }
}