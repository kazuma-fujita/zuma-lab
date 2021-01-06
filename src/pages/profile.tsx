import Layout from '../components/templates/Layout';
import Profile from '../components/templates/Profile';
import { SITE_TITLE } from '../lib/constants';

const ProfilePage = () => (
  <Layout title={`Profile | ${SITE_TITLE}`}>
    <Profile />
  </Layout>
);

export default ProfilePage;
