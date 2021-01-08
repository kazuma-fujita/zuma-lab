import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { FeaturedImageItem } from 'interfaces/FeaturedImageItem';
import { PostItem } from 'interfaces/PostItem';

const useStyles = makeStyles((theme) => ({
  mainFeaturedPost: {
    position: 'relative',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    // backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  mainFeaturedPostContent: {
    position: 'relative',
    padding: theme.spacing(3, 3, 0, 3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6, 6, 3, 6),
      paddingRight: 0,
    },
  },
}));

interface Props {
  item: PostItem;
  featuredImage: FeaturedImageItem;
}

const MainFeaturedPost: React.FC<Props> = ({ item, featuredImage }) => {
  const classes = useStyles();

  return (
    <Link color='inherit' href={`/posts/${item.id}`}>
      <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(${featuredImage.image})` }}>
        {/* Increase the priority of the hero background image */}
        {<img style={{ display: 'none' }} src={featuredImage.image} alt={featuredImage.imageText} />}
        <div className={classes.overlay} />
        <Grid container>
          {/* <Grid item md={8}> */}
          <Grid item>
            <div className={classes.mainFeaturedPostContent}>
              <Typography component='h2' variant='h4' color='inherit' gutterBottom>
                {item.title}
              </Typography>
              <Typography variant='h6' color='inherit' paragraph>
                {item.date}
              </Typography>
              {/* <Typography variant='h5' color='inherit' paragraph>
              {item.contents.substring(0, 60)}
            </Typography> */}
              {/* <Link variant='subtitle1' href={`/posts/${item.id}`}>
              <a>Continue reading…</a>
            </Link> */}
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Link>
  );
};

export default MainFeaturedPost;
