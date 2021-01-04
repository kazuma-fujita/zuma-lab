import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import Header from '../organisms/Header';
import MainFeaturedPost from '../organisms/MainFeaturedPost';
// import FeaturedPost from './FeaturedPost';
import Main from '../organisms/Main';
import Sidebar from '../organisms/Sidebar';
import Footer from '../organisms/Footer';
import FeaturedPost from '../organisms/FeaturedPost';
import { useFetchPostList } from '../../state/PostList/hooks';
// import post1 from '../../posts/post1.md';
// import post2 from '../../posts/post2.md';
// import post3 from '../../posts/post3.md';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

const sections = [
  { title: 'Home', url: '#' },
  { title: 'Profile', url: '#' },
  // { title: 'Contact', url: '#' },
];

const mainFeaturedPost = {
  title: 'Title of a longer featured blog post',
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  image: 'https://source.unsplash.com/random',
  imageText: 'main image description',
  linkText: 'Continue reading…',
};

const featuredPosts = [
  {
    title: 'Featured post',
    date: 'Nov 12',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random',
    imageTitle: 'Image Text',
  },
  {
    title: 'Post title',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random',
    imageTitle: 'Image Text',
  },
];

const sidebar = {
  title: 'Author',
  description: 'ZUMA a.k.a. Kazuma. Web/Mobile App開発。React/iOS/Android。Next/Amplify/Flutter勉強中。',
  archives: [
    { title: 'March 2020', url: '#' },
    { title: 'February 2020', url: '#' },
    { title: 'January 2020', url: '#' },
    { title: 'November 1999', url: '#' },
    { title: 'October 1999', url: '#' },
    { title: 'September 1999', url: '#' },
    { title: 'August 1999', url: '#' },
    { title: 'July 1999', url: '#' },
    { title: 'June 1999', url: '#' },
    { title: 'May 1999', url: '#' },
    { title: 'April 1999', url: '#' },
  ],
  social: [
    { name: 'GitHub', icon: GitHubIcon },
    { name: 'Twitter', icon: TwitterIcon },
    // { name: 'Facebook', icon: FacebookIcon },
  ],
};

// const posts = [post1, post2, post3];

export interface PostItem {
  id: string;
  contents: string;
}

interface Props {
  items: Array<PostItem>;
}

const Layout: React.FC<Props> = ({ items }) => {
  const classes = useStyles();

  console.log('Layout! items:', items);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="ZUMA Tech Blog" sections={sections} />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid container spacing={5} className={classes.mainGrid}>
            <Main title="From the firehose" items={items} />
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </Grid>
        </main>
      </Container>
      <Footer title="Footer" description="Something here to give the footer a purpose!" />
    </>
  );
}

export default Layout;