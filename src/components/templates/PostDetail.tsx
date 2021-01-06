import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MainFeaturedPost from 'components/organisms/MainFeaturedPost';
import { PostItem } from 'interfaces/PostItem';
import HighlightedMarkdown from 'components/atoms/HighlightedMarkdown';
import PostDetailTitle from 'components/organisms/PostDetailTitle';
import { useFetchFeaturedImageItem } from 'state/FeaturedImage/hooks';

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

interface Props {
  item: PostItem;
}

const PostDetail: React.FC<Props> = ({ item, children }) => {
  const classes = useStyles();
  const featuredImage = useFetchFeaturedImageItem();
  return (
    <>
      <PostDetailTitle title={item.title} featuredImage={featuredImage} />
      <Grid container spacing={5} className={classes.mainGrid}>
        <Grid item xs={12} md={8}>
          <HighlightedMarkdown className={classes.markdown} key={item.contents.substring(0, 40)}>
            {item.contents}
          </HighlightedMarkdown>
        </Grid>
        {/* Sidebar */}
        {children}
        {/* Sidebar */}
      </Grid>
    </>
  );
};

export default PostDetail;
