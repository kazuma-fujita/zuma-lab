import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from 'components/templates/Layout';
import { useFetchMonthList, useFetchPostList, useGetAllTagIds, useSearchTagList } from 'state/posts/hooks';
import Sidebar from 'components/organisms/Sidebar';
import { SITE_TITLE } from 'lib/constants';
import { useFetchSNSList } from 'state/SNS/hooks';
import { useFetchAvatarItem } from 'state/Avatar/hooks';
import { useFetchTagList } from 'state/posts/hooks';
import { SidebarProps } from 'interfaces/SidebarProps';
import React from 'react';
import TagSearchResultList from 'components/templates/SearchResultList';
import { PostItem } from 'interfaces/PostItem';
import { useGetProfileMetaDescription } from 'state/profile/hooks';

interface Props extends SidebarProps {
  metaDescription: string;
  searchTag: string;
  searchResults: Array<PostItem>;
}

const TagsPage: React.FC<Props> = ({ metaDescription, searchTag, searchResults, ...rest }) => (
  <Layout title={SITE_TITLE} metaDescription={metaDescription}>
    <TagSearchResultList searchTag={searchTag} items={searchResults}>
      <Sidebar {...rest} />
    </TagSearchResultList>
  </Layout>
);

export default TagsPage;

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
  const archives = useFetchMonthList();

  return Promise.resolve({
    props: {
      metaDescription,
      searchTag,
      searchResults,
      items,
      avatar,
      socials,
      tags,
      archives,
    },
  });
};
