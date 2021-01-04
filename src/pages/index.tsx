// import Link from 'next/link'
import { GetStaticProps } from 'next';
import Layout, { PostItem } from '../components/templates/Layout'
import { POST_LIST } from '../lib/constants';
import { useFetchPostList } from '../state/PostList/hooks';

// const IndexPage = () => (
//   <Layout title="Home | Next.js + TypeScript Example">
//     <h1>Hello Next.js 👋</h1>
//     <p>
//       <Link href="/about">
//         <a>About</a>
//       </Link>
//     </p>
//   </Layout>
// )

interface Props {
  items: Array<PostItem>;
}

const IndexPage: React.FC<Props> = ({ items }) => (
  <Layout title="ZUMA Tech Note" screenName={POST_LIST} items={items} />
);

export default IndexPage;

export const getStaticProps: GetStaticProps = async () => {
  const items = useFetchPostList();
  return {
    props: {
      items
    }
  }
}