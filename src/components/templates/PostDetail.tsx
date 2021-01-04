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
import { PostItem } from './Layout';
import Markdown from '../atoms/Markdown';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  markdown: {
    ...theme.typography.body2,
    padding: theme.spacing(3, 0),
  },
}));

const mainFeaturedPost = {
  title: 'Title of a longer featured blog post',
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  image: 'https://source.unsplash.com/random',
  imageText: 'main image description',
  linkText: 'Continue reading…',
};

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

interface Props {
  item: PostItem;
}

const PostDetail: React.FC<Props> = ({ item, children }) => {
  const classes = useStyles();

  return (
    <>
      <MainFeaturedPost post={mainFeaturedPost} />
      <Grid container spacing={5} className={classes.mainGrid}>
        <Grid item xs={12} md={8}>
          <Markdown className={classes.markdown} key={item.contents.substring(0, 40)}>
            {item.contents}
          </Markdown>
        </Grid>
        {children}
        {/* <Sidebar
          title={sidebar.title}
          description={sidebar.description}
          archives={sidebar.archives}
          social={sidebar.social}
        /> */}
      </Grid>
    </>
  );
}

export default PostDetail;