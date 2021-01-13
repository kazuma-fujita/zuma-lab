import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { PostItem } from 'interfaces/PostItem';
import { Box, Link, makeStyles, Theme } from '@material-ui/core';
import Chips from 'components/molecules/Chips';

const useStyles = makeStyles((theme: Theme) => ({
  postTitle: {
    // モバイル表示時に表示崩れを防ぐ為、強制文字折返しをいれる
    [theme.breakpoints.down('md')]: {
      wordBreak: 'break-all',
    },
  },
}));

interface Props {
  title: string;
  items: Array<PostItem>;
}

const NewPostList: React.FC<Props> = ({ title, items }) => {
  const classes = useStyles();
  return (
    <Grid item xs={12} md={8}>
      <Typography variant='h6' gutterBottom>
        {title}
      </Typography>
      {items.map(({ id, title, date, tags }) => (
        <div key={title}>
          <Box mt={4} mb={4}>
            <Typography component='h4' variant='h6' className={classes.postTitle}>
              <Link color='inherit' href={`/posts/${id}`}>
                {title}
              </Link>
            </Typography>
            <Typography variant='subtitle1' color='textSecondary'>
              <time>{date}</time>
            </Typography>
            <Chips tags={tags} />
          </Box>
        </div>
      ))}
    </Grid>
  );
};

export default NewPostList;
