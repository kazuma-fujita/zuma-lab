import { GetStaticProps } from 'next';
import Layout from '../components/templates/Layout';
import { PostItem } from '../interfaces/PostItem';
import { useFetchPostList } from '../state/PostList/hooks';
import PostList from '../components/templates/PostList';
import Sidebar from '../components/organisms/Sidebar';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import { SITE_TITLE } from '../lib/constants';

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
  items: Array<PostItem>;
}

const IndexPage: React.FC<Props> = ({ items }) => (
  // <Layout title='ZUMA Tech Note' screenName={POST_LIST} items={items} />
  <Layout title={SITE_TITLE}>
    <PostList items={items}>
      <Sidebar
        title={sidebar.title}
        description={sidebar.description}
        archives={sidebar.archives}
        social={sidebar.social}
      />
    </PostList>
  </Layout>
);

export default IndexPage;

export const getStaticProps: GetStaticProps = async () => {
  const items = useFetchPostList();
  return {
    props: {
      items,
    },
  };
};
