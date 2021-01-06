import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MainFeaturedPost from '../organisms/MainFeaturedPost';
import NewPostList from '../organisms/NewPostList';
import FeaturedPost from '../organisms/FeaturedPost';
import { PostItem } from '../../interfaces/PostItem';
import { useFetchFeaturedImageItem } from 'state/FeaturedImage/hooks';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
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

const featuredPosts = [
  {
    title: 'Featured post',
    date: 'Nov 12',
    description: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random',
    imageTitle: 'Image Text',
  },
  {
    title: 'Post title',
    date: 'Nov 11',
    description: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random',
    imageTitle: 'Image Text',
  },
];

interface Props {
  items: Array<PostItem>;
}

const PostList: React.FC<Props> = ({ items, children }) => {
  const classes = useStyles();
  const featuredImage = useFetchFeaturedImageItem();
  return (
    <>
      <MainFeaturedPost item={items[0]} featuredImage={featuredImage} />
      <Grid container spacing={4}>
        <FeaturedPost key={items[1].title} item={items[1]} featuredImage={featuredImage} />
        <FeaturedPost key={items[2].title} item={items[2]} featuredImage={featuredImage} />
        {/* {featuredPosts.map((post) => (
          <FeaturedPost key={post.title} post={post} />
        ))} */}
      </Grid>
      <Grid container spacing={5} className={classes.mainGrid}>
        <NewPostList title='Recent Posts' items={items} />
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
};

export default PostList;
