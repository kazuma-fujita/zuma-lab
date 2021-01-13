import Layout from 'components/templates/Layout';
import Profile from 'components/templates/Profile';
import { AvatarItem } from 'interfaces/AvatarItem';
import { SNSItem } from 'interfaces/SNSItem';
import { SITE_TITLE } from 'lib/constants';
import { GetStaticProps } from 'next';
import { useFetchAvatarItem } from 'state/Avatar/hooks';
import { useFetchProfileDescriptionList, useFetchProfileMainSkillList } from 'state/profile/hooks';
import { useFetchSNSList } from 'state/SNS/hooks';
import { ProfileDescriptionItem } from 'interfaces/ProfileDescriptionItem';
import { useFetchProfileSubSkillList } from '../state/profile/hooks';
import { ProfileSubSkillItem } from '../interfaces/ProfileSubSkillItem';
import { ProfileMainSkillItem } from 'interfaces/ProfileMainSkillItem';

export interface ProfileProps {
  avatar: AvatarItem;
  socials: Array<SNSItem>;
  descriptions: Array<ProfileDescriptionItem>;
  mainSkills: Array<ProfileMainSkillItem>;
  subSkills: Array<ProfileSubSkillItem>;
}

const metaDescription =
  '普段WebやMobileアプリ開発をしているエンジニアが個人開発を通して学んだ技術を発信をするブログです。React/TypeScript/Next/Flutter/GraphQL/AWS/Amplifyなどの話題を発信します。';

const ProfilePage: React.FC<ProfileProps> = ({ ...rest }) => (
  <Layout title={`Profile | ${SITE_TITLE}`} metaDescription={metaDescription}>
    <Profile {...rest} />
  </Layout>
);

export default ProfilePage;

export const getStaticProps: GetStaticProps = async () => {
  const avatar = useFetchAvatarItem();
  const socials = useFetchSNSList();
  const descriptions = useFetchProfileDescriptionList();
  const mainSkills = useFetchProfileMainSkillList();
  const subSkills = useFetchProfileSubSkillList();
  return Promise.resolve({
    props: {
      avatar,
      socials,
      descriptions,
      mainSkills,
      subSkills,
    },
  });
};
