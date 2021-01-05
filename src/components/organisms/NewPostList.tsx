import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Markdown from '../atoms/Markdown';
import { PostItem } from '../../interfaces/PostItem';
import Link from 'next/link';

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

const NewPostList: React.FC<Props> = ({ items, title }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={8}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider />
      {items.map(({ id, title, date, contents }) => (
        <>
        <Link href={`/posts/${id}`}>
          <a>{title}</a>
        </Link>
        <br />
        <small>
          {date}
          {/* <Date dateString={date} /> */}
        </small>
        <br />
        <br />
        <Markdown className={classes.markdown} key={contents.substring(0, 40)}>
          {contents}
        </Markdown>
        </>
      ))}
    </Grid>
  );
}

export default NewPostList;
