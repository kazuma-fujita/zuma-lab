import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from 'components/templates/Layout';
import { useGetAllTagIds, useSearchTagList } from 'state/posts/hooks';
import Sidebar from 'components/organisms/Sidebar';
import { SITE_TITLE } from 'lib/constants';
import { useFetchSNSList } from 'state/SNS/hooks';
import { useFetchAvatarItem } from 'state/Avatar/hooks';
import { useFetchTagList } from 'state/posts/hooks';
import { SidebarProps } from 'interfaces/SidebarProps';
import React from 'react';
import TagSearchResultList from 'components/templates/TagSearchResultList';

const metaDescription = 'Tagの検索結果一覧です。';

interface Props extends SidebarProps {
  searchTag: string;
}

const Tag: React.FC<Props> = ({ searchTag, items, avatar, socials, tags }) => (
  <Layout title={SITE_TITLE} metaDescription={metaDescription}>
    <TagSearchResultList searchTag={searchTag} items={items}>
      <Sidebar avatar={avatar} socials={socials} items={items} tags={tags} />
    </TagSearchResultList>
  </Layout>
);

export default Tag;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = useGetAllTagIds();
  return Promise.resolve({
    paths,
    fallback: false,
  });
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const searchTag = params?.tag as string;
  const avatar = useFetchAvatarItem();
  const socials = useFetchSNSList();
  const items = useSearchTagList(searchTag);
  const tags = useFetchTagList();

  return Promise.resolve({
    props: {
      searchTag,
      items,
      avatar,
      socials,
      tags,
    },
  });
};
