import Layout from 'components/templates/Layout';
import { SITE_TITLE } from 'lib/constants';
import { GetStaticProps } from 'next';
import { useGetPrivacyMetaDescription } from 'state/privacy/hooks';
import Contact from 'components/templates/Contact';
import { useFetchSNSList } from 'state/SNS/hooks';
import { SNSItem } from 'interfaces/SNSItem';

export interface Props {
  metaDescription: string;
  socials: Array<SNSItem>;
}

const ContactPage: React.FC<Props> = ({ metaDescription, socials }) => {
  return (
    <Layout title={`お問い合わせ | ${SITE_TITLE}`} metaDescription={metaDescription}>
      <Contact socials={socials} />
    </Layout>
  );
};

export default ContactPage;

export const getStaticProps: GetStaticProps = async () => {
  const metaDescription = useGetPrivacyMetaDescription();
  const socials = useFetchSNSList();
  return Promise.resolve({
    props: {
      metaDescription,
      socials,
    },
  });
};
