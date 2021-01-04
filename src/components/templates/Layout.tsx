import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import Header from '../organisms/Header';
import MainFeaturedPost from '../organisms/MainFeaturedPost';
import Main from '../organisms/NewPostList';
import Sidebar from '../organisms/Sidebar';
import Footer from '../organisms/Footer';
import FeaturedPost from '../organisms/FeaturedPost';
import Head from 'next/head';
import { POST_DETAIL, POST_LIST, ScreenName } from '../../lib/constants';
import PostList from './PostList';
import PostDetail from './PostDetail';

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

export interface PostItem {
  id: string;
  contents: string;
}

interface ScreenProps {
  screenName: ScreenName;
  items?: Array<PostItem>;
  item?: PostItem;
}

interface Props extends ScreenProps {
  title: string;
}

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
  ],
};

const SelectComponent: React.FC<ScreenProps> = ({ screenName, items, item, children }) => {
  switch (screenName) {
    case POST_LIST:
      return <PostList items={items!}>{children}</PostList>;
    case POST_DETAIL:
      return <PostDetail item={item!}>{children}</PostDetail>;
    default:
      throw new Error('Unknown screen index.');
  }
}

const Layout: React.FC<Props> = ({ title, screenName, items, item }) => {
  // const classes = useStyles();
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Learn how to build a personal website using Next.js" />
        <meta property="og:image" content={`https://og-image.now.sh/${encodeURI(title)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`} />
        <meta name="og:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title={title} sections={sections} />
        <main>
          <SelectComponent screenName={screenName} items={items} item={item}>
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </SelectComponent>
          {/* <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid container spacing={5} className={classes.mainGrid}>
            <Main title="記事一覧" items={items} />
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </Grid> */}
        </main>
      </Container>
      <Footer title="Footer" description="Something here to give the footer a purpose!" />
    </>
  );
}

export default Layout;