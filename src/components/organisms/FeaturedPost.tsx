import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';
import { PostItem } from 'interfaces/PostItem';
import { FeaturedImageItem } from 'interfaces/FeaturedImageItem';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
  postTitle: {
    // モバイル表示時に表示崩れを防ぐ為、強制文字折返しをいれる
    [theme.breakpoints.down('md')]: {
      wordBreak: 'break-all',
    },
  },
}));

interface Props {
  item: PostItem;
  featuredImage: FeaturedImageItem;
}

const FeaturedPost: React.FC<Props> = ({ item, featuredImage }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component='a' href={`/posts/${item.id}`}>
        <Card className={classes.card}>
          <div className={classes.cardDetails}>
            <CardContent>
              <Typography component='h2' variant='h5' className={classes.postTitle}>
                {item.title}
              </Typography>
              <Typography variant='subtitle1' color='textSecondary'>
                {item.date}
              </Typography>
              {/* <Typography variant='subtitle1' paragraph>
                {item.contents.substring(0, 60)}
              </Typography> */}
              {/* <Typography variant='subtitle1' color='primary'>
                <Link variant='subtitle1' href={`/posts/${item.id}`}>
                  Continue reading...
                </Link>
              </Typography> */}
            </CardContent>
          </div>
          <Hidden xsDown>
            <CardMedia className={classes.cardMedia} image={featuredImage.image} title={featuredImage.imageText} />
          </Hidden>
        </Card>
      </CardActionArea>
    </Grid>
  );
};

export default FeaturedPost;
