import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useFetchPostList } from '../../state/PostList/hooks';
// import Markdown from './Markdown';

const useStyles = makeStyles((theme) => ({
  markdown: {
    ...theme.typography.body2,
    padding: theme.spacing(3, 0),
  },
}));

interface Props {
  // posts: Array<object>;
  title: string;
}

// const Main: React.FC<Props> = ({ posts, title }) => {
const Main: React.FC<Props> = ({ title }) => {
  // const classes = useStyles();

  return (
    <Grid item xs={12} md={8}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider />
      {/* {posts.map((post) => (
        <Markdown className={classes.markdown} key={post.substring(0, 40)}>
          {post}
        </Markdown>
      ))} */}
    </Grid>
  );
}

export async function getStaticProps() {
  const allPostsData = useFetchPostList();
  return {
    props: {
      allPostsData
    }
  }
}

export default Main;
