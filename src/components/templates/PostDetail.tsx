import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MainFeaturedPost from '../organisms/MainFeaturedPost';
import { PostItem } from '../../interfaces/PostItem';
import HighlightedMarkdown from '../atoms/HighlightedMarkdown';

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

  return (
    <>
      <MainFeaturedPost post={mainFeaturedPost} />
      <Grid container spacing={5} className={classes.mainGrid}>
        <Grid item xs={12} md={8}>
          <HighlightedMarkdown className={classes.markdown} key={item.contents.substring(0, 40)}>
            {item.contents}
          </HighlightedMarkdown>
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
};

export default PostDetail;
