import Layout from 'components/templates/Layout';
import Profile from 'components/templates/Profile';
import { SITE_TITLE } from 'lib/constants';
import { GetStaticProps } from 'next';
import { useFetchAvatarItem } from 'state/Avatar/hooks';
import {
  // useFetchProfileDescriptionList,
  useFetchProfileMainSkillList,
  useGetProfileContents,
} from 'state/profile/hooks';
import { useFetchSNSList } from 'state/SNS/hooks';
import { useFetchProfileSubSkillList, useGetProfileMetaDescription } from '../state/profile/hooks';
import { ProfileProps } from 'interfaces/ProfileProps';

export interface Props extends ProfileProps {
  metaDescription: string;
}

const ProfilePage: React.FC<Props> = ({ metaDescription, ...rest }) => {
  return (
    <Layout title={`Profile | ${SITE_TITLE}`} metaDescription={metaDescription}>
      <Profile {...rest} />
    </Layout>
  );
};

export default ProfilePage;

export const getStaticProps: GetStaticProps = async () => {
  const avatar = useFetchAvatarItem();
  const socials = useFetchSNSList();
  // const descriptions = useFetchProfileDescriptionList();
  const mainSkills = useFetchProfileMainSkillList();
  const subSkills = useFetchProfileSubSkillList();
  const metaDescription = useGetProfileMetaDescription();
  const contents = useGetProfileContents();
  return Promise.resolve({
    props: {
      metaDescription,
      avatar,
      socials,
      // descriptions,
      mainSkills,
      subSkills,
      contents,
    },
  });
};
