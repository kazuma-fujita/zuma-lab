import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useFetchPostList } from '../../state/PostList/hooks';
import Markdown from '../atoms/Markdown';
import { PostItem } from '../templates/Layout';

const useStyles = makeStyles((theme) => ({
  markdown: {
    ...theme.typography.body2,
    padding: theme.spacing(3, 0),
  },
}));

interface Props {
  items: Array<PostItem>;
  title: string;
}

const Main: React.FC<Props> = ({ items, title }) => {
  const classes = useStyles();
  console.log('items:', items);

  return (
    <Grid item xs={12} md={8}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider />
      {items.map((item) => (
        <Markdown className={classes.markdown} key={item.contents.substring(0, 40)}>
          {item.contents}
        </Markdown>
      ))}
    </Grid>
  );
}

export default Main;
