import { GetStaticProps } from 'next';
import Layout from 'components/templates/Layout';
import { useFetchMonthList, useFetchPostList, useFetchTagList } from 'state/posts/hooks';
import PostList from 'components/templates/PostList';
import Sidebar from 'components/organisms/Sidebar';
import { SITE_TITLE } from 'lib/constants';
import { useFetchSNSList } from 'state/SNS/hooks';
import { useFetchAvatarItem } from 'state/Avatar/hooks';
import { SidebarProps } from '../interfaces/SidebarProps';
import { useGetProfileMetaDescription } from 'state/profile/hooks';

interface Props extends SidebarProps {
  metaDescription: string;
}

const IndexPage: React.FC<Props> = ({ metaDescription, items, avatar, socials, tags, archives }) => (
  <Layout title={SITE_TITLE} metaDescription={metaDescription}>
    <PostList items={items}>
      <Sidebar avatar={avatar} socials={socials} items={items} tags={tags} archives={archives} />
    </PostList>
  </Layout>
);

export default IndexPage;

export const getStaticProps: GetStaticProps = async () => {
  const avatar = useFetchAvatarItem();
  const socials = useFetchSNSList();
  const items = useFetchPostList();
  const tags = useFetchTagList();
  const archives = useFetchMonthList();
  const metaDescription = useGetProfileMetaDescription();
  return Promise.resolve({
    props: {
      metaDescription,
      avatar,
      socials,
      items,
      tags,
      archives,
    },
  });
};
