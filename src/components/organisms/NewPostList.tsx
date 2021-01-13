import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { PostItem } from 'interfaces/PostItem';
import { Box, Link } from '@material-ui/core';
import Chips from 'components/molecules/Chips';

interface Props {
  title: string;
  items: Array<PostItem>;
}

const NewPostList: React.FC<Props> = ({ title, items }) => (
  <Grid item xs={12} md={8}>
    <Typography variant='h6' gutterBottom>
      {title}
    </Typography>
    <Divider />
    {items.map(({ id, title, date, tags }) => (
      <div key={title}>
        <Box mt={4} mb={4}>
          <Typography component='h4' variant='h6'>
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

export default NewPostList;
