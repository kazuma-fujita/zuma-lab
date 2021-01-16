import Layout from 'components/templates/Layout';
import { SITE_TITLE } from 'lib/constants';
import { GetStaticProps } from 'next';
import { useGetPrivacyMetaDescription } from 'state/privacy/hooks';
import Contact from 'components/templates/Contact';

export interface Props {
  metaDescription: string;
}

const ContactPage: React.FC<Props> = ({ metaDescription }) => {
  return (
    <Layout title={`お問い合わせ | ${SITE_TITLE}`} metaDescription={metaDescription}>
      <Contact />
    </Layout>
  );
};

export default ContactPage;

export const getStaticProps: GetStaticProps = async () => {
  const metaDescription = useGetPrivacyMetaDescription();
  return Promise.resolve({
    props: {
      metaDescription,
    },
  });
};
