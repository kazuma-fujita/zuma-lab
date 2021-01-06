import Layout from 'components/templates/Layout';
import Profile from 'components/templates/Profile';
import { AvatarItem } from 'interfaces/AvatarItem';
import { SITE_TITLE } from 'lib/constants';
import { GetStaticProps } from 'next';
import { useFetchAvatarItem } from 'state/Avatar/hooks';

interface Props {
  avatar: AvatarItem;
}

const ProfilePage: React.FC<Props> = ({ avatar }) => (
  <Layout title={`Profile | ${SITE_TITLE}`}>
    <Profile avatar={avatar} />
  </Layout>
);

export default ProfilePage;

export const getStaticProps: GetStaticProps = async () => {
  const avatar = useFetchAvatarItem();
  return {
    props: {
      avatar,
    },
  };
};
