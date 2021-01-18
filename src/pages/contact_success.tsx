import Layout from 'components/templates/Layout';
import { SITE_TITLE } from 'lib/constants';
import { GetStaticProps } from 'next';
import ContactSuccess from 'components/templates/ContactSuccess';
import { useGetContactMetaDescription } from 'state/contact/useGetContactMetaDescription';

export interface Props {
  metaDescription: string;
}

const ContactSuccessPage: React.FC<Props> = ({ metaDescription }) => {
  return (
    <Layout title={`お問い合わせ | ${SITE_TITLE}`} metaDescription={metaDescription}>
      <ContactSuccess />
    </Layout>
  );
};

export default ContactSuccessPage;

export const getStaticProps: GetStaticProps = async () => {
  const metaDescription = useGetContactMetaDescription();
  return Promise.resolve({
    props: {
      metaDescription,
    },
  });
};
