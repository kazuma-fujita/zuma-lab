import Layout from 'components/templates/Layout';
import { SITE_TITLE } from 'lib/constants';
import { GetStaticProps } from 'next';
import { PrivacyProps } from 'interfaces/PrivacyProps';
import Privacy from 'components/templates/Privacy';
import { useFetchPrivacyDescriptionList, useGetPrivacyMetaDescription } from 'state/privacy/hooks';

export interface Props extends PrivacyProps {
  metaDescription: string;
}

const PrivacyPage: React.FC<Props> = ({ metaDescription, ...rest }) => {
  return (
    <Layout title={`Privacy Policy | ${SITE_TITLE}`} metaDescription={metaDescription}>
      <Privacy {...rest} />
    </Layout>
  );
};

export default PrivacyPage;

export const getStaticProps: GetStaticProps = async () => {
  const privacies = useFetchPrivacyDescriptionList();
  const metaDescription = useGetPrivacyMetaDescription();
  return Promise.resolve({
    props: {
      metaDescription,
      privacies,
    },
  });
};
