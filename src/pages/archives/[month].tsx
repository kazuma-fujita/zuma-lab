import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from 'components/templates/Layout';
import { useFetchPostList, useGetAllArchiveIds, useSearchMonthList } from 'state/posts/hooks';
import Sidebar from 'components/organisms/Sidebar';
import { SITE_TITLE } from 'lib/constants';
import { useFetchSNSList } from 'state/SNS/hooks';
import { useFetchAvatarItem } from 'state/Avatar/hooks';
import { useFetchTagList } from 'state/posts/hooks';
import { SidebarProps } from 'interfaces/SidebarProps';
import React from 'react';
import SearchResultList from 'components/templates/SearchResultList';
import { PostItem } from 'interfaces/PostItem';
import { useGetProfileMetaDescription } from 'state/profile/hooks';
import { useFetchMonthList } from 'state/posts/hooks';

interface Props extends SidebarProps {
  metaDescription: string;
  searchMonth: string;
  searchResults: Array<PostItem>;
}

const ArchivesPage: React.FC<Props> = ({ metaDescription, searchMonth, searchResults, ...rest }) => (
  <Layout title={SITE_TITLE} metaDescription={metaDescription}>
    <SearchResultList searchTag={searchMonth} items={searchResults}>
      <Sidebar {...rest} />
    </SearchResultList>
  </Layout>
);

export default ArchivesPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = useGetAllArchiveIds();
  return Promise.resolve({
    paths,
    fallback: false,
  });
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const searchMonth = params?.month as string;
  const metaDescription = useGetProfileMetaDescription();
  const searchResults = useSearchMonthList(searchMonth);
  const avatar = useFetchAvatarItem();
  const socials = useFetchSNSList();
  const items = useFetchPostList();
  const tags = useFetchTagList();
  const archives = useFetchMonthList();

  return Promise.resolve({
    props: {
      metaDescription,
      searchMonth,
      searchResults,
      items,
      avatar,
      socials,
      tags,
      archives,
    },
  });
};
