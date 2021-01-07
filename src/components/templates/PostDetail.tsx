import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { PostItem } from 'interfaces/PostItem';
import HighlightedMarkdown from 'components/atoms/HighlightedMarkdown';
import PostDetailTitle from 'components/organisms/PostDetailTitle';
import { useFetchFeaturedImageItem } from 'state/FeaturedImage/hooks';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
  markdown: {
    ...theme.typography.body2,
    // PCサイズ時のみ下と左にpaddingを入れる
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 0, 8, 16),
    },
  },
  publishedDate: {
    paddingBottom: theme.spacing(2),
    // PCサイズ時のみ左にpaddingを入れる
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(16),
    },
  },
}));

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
          <Typography variant='subtitle1' color='textSecondary' className={classes.publishedDate}>
            <time>{item.date}</time>
          </Typography>
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
