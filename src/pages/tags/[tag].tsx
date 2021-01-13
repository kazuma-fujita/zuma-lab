import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from 'components/templates/Layout';
import { useFetchPostList, useGetAllTagIds, useSearchTagList } from 'state/posts/hooks';
import Sidebar from 'components/organisms/Sidebar';
import { SITE_TITLE } from 'lib/constants';
import { useFetchSNSList } from 'state/SNS/hooks';
import { useFetchAvatarItem } from 'state/Avatar/hooks';
import { useFetchTagList } from 'state/posts/hooks';
import { SidebarProps } from 'interfaces/SidebarProps';
import React from 'react';
import TagSearchResultList from 'components/templates/TagSearchResultList';
import { PostItem } from 'interfaces/PostItem';
import { useGetProfileMetaDescription } from 'state/profile/hooks';

interface Props extends SidebarProps {
  metaDescription: string;
  searchTag: string;
  searchResults: Array<PostItem>;
}

const Tag: React.FC<Props> = ({ metaDescription, searchTag, searchResults, items, avatar, socials, tags }) => (
  <Layout title={SITE_TITLE} metaDescription={metaDescription}>
    <TagSearchResultList searchTag={searchTag} items={searchResults}>
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
  const metaDescription = useGetProfileMetaDescription();
  const searchResults = useSearchTagList(searchTag);
  const avatar = useFetchAvatarItem();
  const socials = useFetchSNSList();
  const items = useFetchPostList();
  const tags = useFetchTagList();

  return Promise.resolve({
    props: {
      metaDescription,
      searchTag,
      searchResults,
      items,
      avatar,
      socials,
      tags,
    },
  });
};
