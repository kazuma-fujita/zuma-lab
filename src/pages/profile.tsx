import Layout from 'components/templates/Layout';
import Profile from 'components/templates/Profile';
import { AvatarItem } from 'interfaces/AvatarItem';
import { SNSItem } from 'interfaces/SNSItem';
import { SITE_TITLE } from 'lib/constants';
import { GetStaticProps } from 'next';
import { useFetchAvatarItem } from 'state/Avatar/hooks';
import { useFetchProfileDescriptionList } from 'state/Profile/hooks';
import { useFetchSNSList } from 'state/SNS/hooks';
import { ProfileDescriptionItem } from 'interfaces/ProfileDescriptionItem';

interface Props {
  avatar: AvatarItem;
  socials: Array<SNSItem>;
  descriptions: Array<ProfileDescriptionItem>;
}

const ProfilePage: React.FC<Props> = ({ avatar, socials, descriptions }) => (
  <Layout title={`Profile | ${SITE_TITLE}`}>
    <Profile avatar={avatar} socials={socials} descriptions={descriptions} />
  </Layout>
);

export default ProfilePage;

export const getStaticProps: GetStaticProps = async () => {
  const avatar = useFetchAvatarItem();
  const socials = useFetchSNSList();
  const descriptions = useFetchProfileDescriptionList();
  return {
    props: {
      avatar,
      socials,
      descriptions,
    },
  };
};
