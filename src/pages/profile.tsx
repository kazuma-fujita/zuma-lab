import Layout from 'components/templates/Layout';
import Profile from 'components/templates/Profile';
import { AvatarItem } from 'interfaces/AvatarItem';
import { SNSItem } from 'interfaces/SNSItem';
import { SITE_TITLE } from 'lib/constants';
import { GetStaticProps } from 'next';
import { useFetchAvatarItem } from 'state/Avatar/hooks';
import { useFetchSNSList } from 'state/SNS/hooks';

interface Props {
  avatar: AvatarItem;
  socials: Array<SNSItem>;
}

const ProfilePage: React.FC<Props> = ({ avatar, socials }) => (
  <Layout title={`Profile | ${SITE_TITLE}`}>
    <Profile avatar={avatar} socials={socials} />
  </Layout>
);

export default ProfilePage;

export const getStaticProps: GetStaticProps = async () => {
  const avatar = useFetchAvatarItem();
  const socials = useFetchSNSList();
  return {
    props: {
      avatar,
      socials,
    },
  };
};
