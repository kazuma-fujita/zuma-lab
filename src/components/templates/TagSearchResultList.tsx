import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import NewPostList from 'components/organisms/NewPostList';
import { PostItem } from 'interfaces/PostItem';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
    // PCサイズ時のみ下と左にpaddingを入れる
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 0, 8, 16),
    },
  },
}));

interface Props {
  searchTag: string;
  items: Array<PostItem>;
}

const TagSearchResultList: React.FC<Props> = ({ searchTag, items, children }) => {
  const classes = useStyles();
  return (
    <>
      <Grid container spacing={5} className={classes.mainGrid}>
        <NewPostList title={`${searchTag} tag search results`} items={items} />
        {/* Sidebar */}
        {children}
        {/* Sidebar */}
      </Grid>
    </>
  );
};

export default TagSearchResultList;
