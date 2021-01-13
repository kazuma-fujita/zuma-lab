import { GetStaticProps } from 'next';
import Layout from 'components/templates/Layout';
import { useFetchPostList, useFetchTagList } from 'state/posts/hooks';
import PostList from 'components/templates/PostList';
import Sidebar from 'components/organisms/Sidebar';
import { SITE_TITLE } from 'lib/constants';
import { useFetchSNSList } from 'state/SNS/hooks';
import { useFetchAvatarItem } from 'state/Avatar/hooks';
import { SidebarProps } from '../interfaces/SidebarProps';

const metaDescription =
  '普段WebやMobileアプリ開発をしているエンジニアが個人開発を通して学んだ技術を発信をするブログです。React/TypeScript/Next/Flutter/GraphQL/AWS/Amplifyなどの話題を発信します。';

const IndexPage: React.FC<SidebarProps> = ({ items, avatar, socials, tags }) => (
  <Layout title={SITE_TITLE} metaDescription={metaDescription}>
    <PostList items={items}>
      <Sidebar avatar={avatar} socials={socials} items={items} tags={tags} />
    </PostList>
  </Layout>
);

export default IndexPage;

export const getStaticProps: GetStaticProps = async () => {
  const avatar = useFetchAvatarItem();
  const socials = useFetchSNSList();
  const items = useFetchPostList();
  const tags = useFetchTagList();
  return Promise.resolve({
    props: {
      avatar,
      socials,
      items,
      tags,
    },
  });
};
