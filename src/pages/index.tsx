import Link from 'next/link'
import Layout, { PostItem } from '../components/templates/Layout'
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
  <Layout items={items} />
);

export async function getStaticProps() {
  const items = useFetchPostList();
  return {
    props: {
      items
    }
  }
}

export default IndexPage
