import { GetStaticProps } from 'next';
import Layout from 'components/templates/Layout';
import { PostItem } from 'interfaces/PostItem';
import { useFetchPostList } from 'state/PostList/hooks';
import PostList from 'components/templates/PostList';
import Sidebar from 'components/organisms/Sidebar';
import { SITE_TITLE } from 'lib/constants';
import { useFetchSNSList } from 'state/SNS/hooks';
import { SNSItem } from 'interfaces/SNSItem';
import { useFetchAvatarItem } from 'state/Avatar/hooks';
import { AvatarItem } from 'interfaces/AvatarItem';

// const sidebar = {
//   archives: [{ title: 'March 2020', url: '#' }],
// };

interface Props {
  avatar: AvatarItem;
  socials: Array<SNSItem>;
  items: Array<PostItem>;
}

const IndexPage: React.FC<Props> = ({ avatar, socials, items }) => (
  // <Layout title='ZUMA Tech Note' screenName={POST_LIST} items={items} />
  <Layout title={SITE_TITLE}>
    <PostList items={items}>
      {/* <Sidebar title={sidebar.title} description={sidebar.description} archives={sidebar.archives} socials={socials} /> */}
      <Sidebar avatar={avatar} socials={socials} />
    </PostList>
  </Layout>
);

export default IndexPage;

export const getStaticProps: GetStaticProps = async () => {
  const avatar = useFetchAvatarItem();
  const socials = useFetchSNSList();
  const items = useFetchPostList();
  return {
    props: {
      avatar,
      socials,
      items,
    },
  };
};
