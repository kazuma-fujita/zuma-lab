import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MainFeaturedPost from 'components/organisms/MainFeaturedPost';
import NewPostList from 'components/organisms/NewPostList';
import FeaturedPost from 'components/organisms/FeaturedPost';
import { PostItem } from 'interfaces/PostItem';
import { useFetchFeaturedImageItem } from 'state/FeaturedImage/hooks';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

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
        {/* Sidebar */}
        {children}
        {/* Sidebar */}
      </Grid>
    </>
  );
};

export default PostList;
