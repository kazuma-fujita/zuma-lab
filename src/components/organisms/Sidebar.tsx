import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import { SNSItem } from 'interfaces/SNSItem';
import { Avatar, Box, Typography } from '@material-ui/core';
import { AvatarItem } from 'interfaces/AvatarItem';
import SocialLinkIcon from 'components/molecules/SocialLinkIcon';
import { PostItem } from 'interfaces/PostItem';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  sidebarAboutBox: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200],
    // textAlign: 'center',
  },
  sidebarSection: {
    marginTop: theme.spacing(3),
  },
  largeAvatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  mainGrid: {
    marginBottom: theme.spacing(16), // Sidebar下部にTopへ戻るボタンがある為、marginを開ける
  },
  linkMargin: {
    margin: theme.spacing(2, 0, 2, 0),
  },
}));

// interface Archive {
//   title: string;
//   url: string;
// }

interface Props {
  // archives: Array<Archive>;
  avatar: AvatarItem;
  socials: Array<SNSItem>;
  items: Array<PostItem>;
}

// const Sidebar: React.FC<Props> = ({ archives, description, socials, title }) => {
const Sidebar: React.FC<Props> = ({ avatar, socials, items }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={4} className={classes.mainGrid}>
      <Paper elevation={0} className={classes.sidebarAboutBox}>
        <Grid container spacing={2} justify='center'>
          <Grid item>
            <Link href='/profile'>
              <Avatar className={classes.largeAvatar} src={avatar.image} />
            </Link>
          </Grid>
          <Grid item>
            {/* <Typography>{description}</Typography> */}
            {avatar.description}&nbsp;&nbsp;
            <Link href='/profile'>My profile.</Link>
          </Grid>
        </Grid>
        <Box mb={2} />
        <Grid container spacing={8} justify='center'>
          {socials.map((social) => (
            <Grid item key={social.name}>
              <SocialLinkIcon name={social.name} url={social.url} largeIcon />
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Typography variant='h6' gutterBottom className={classes.sidebarSection}>
        Recent Posts
      </Typography>
      {items.map(({ id, date, title }) => (
        <div key={id}>
          <div className={classes.linkMargin} key={id + date}>
            <Link display='block' variant='body2' color='inherit' href={`/posts/${id}`} key={title}>
              {title}
            </Link>
            <Link display='block' variant='body2' color='textSecondary' href={`/posts/${id}`} key={date}>
              {date}
            </Link>
          </div>
          <Divider />
        </div>
      ))}
      {/* <Typography variant='h6' gutterBottom className={classes.sidebarSection}>
        Archives
      </Typography>
      {archives.map((archive) => (
        <Link display='block' variant='body1' href={archive.url} key={archive.title}>
          {archive.title}
        </Link>
      ))} */}
      {/* <Typography variant='h6' gutterBottom className={classes.sidebarSection}>
        Social
      </Typography>
      {social.map((network) => (
        <Link display='block' variant='body1' href='#' key={network.name}>
          <Grid container direction='row' spacing={1} alignItems='center'>
            <Grid item>
              <network.icon />
            </Grid>
            <Grid item>{network.name}</Grid>
          </Grid>
        </Link>
      ))} */}
    </Grid>
  );
};

export default Sidebar;
