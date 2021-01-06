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
import { POST_DETAIL, POST_LIST, ScreenName, SITE_TITLE } from '../../lib/constants';
import PostList from './PostList';
import PostDetail from './PostDetail';
import { PostItem } from '../../interfaces/PostItem';

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

// interface ScreenProps {
//   screenName: ScreenName;
//   items?: Array<PostItem>;
//   item?: PostItem;
// }

// interface Props extends ScreenProps {
//   title: string;
// }

interface Props {
  title: string;
}

// const SelectComponent: React.FC<ScreenProps> = ({ screenName, items, item, children }) => {
//   switch (screenName) {
//     case POST_LIST:
//       return <PostList items={items!}>{children}</PostList>;
//     case POST_DETAIL:
//       return <PostDetail item={item!}>{children}</PostDetail>;
//     default:
//       throw new Error('Unknown screen index.');
//   }
// };

// const Layout: React.FC<Props> = ({ title, screenName, items, item }) => {
const Layout: React.FC<Props> = ({ title, children }) => {
  // const classes = useStyles();
  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <title>{title}</title>
        <meta name='description' content='Learn how to build a personal website using Next.js' />
        <meta
          property='og:image'
          content={`https://og-image.now.sh/${encodeURI(
            title
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name='og:title' content={title} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <CssBaseline />
      <Container maxWidth='lg'>
        <Header title={SITE_TITLE} sections={sections} />
        <main>
          {children}
          {/* <SelectComponent screenName={screenName} items={items} item={item}>
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </SelectComponent> */}
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
      <Footer title='Footer' description='Something here to give the footer a purpose!' />
    </>
  );
};

export default Layout;
