import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { SNSItem } from '../../interfaces/SNSItem';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Avatar, Box } from '@material-ui/core';

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
}));

// interface Archive {
//   title: string;
//   url: string;
// }

interface Props {
  // archives: Array<Archive>;
  description: string;
  socials: Array<SNSItem>;
}

// const Sidebar: React.FC<Props> = ({ archives, description, socials, title }) => {
const Sidebar: React.FC<Props> = ({ description, socials }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={4}>
      <Paper elevation={0} className={classes.sidebarAboutBox}>
        {/* <Typography variant='h6' gutterBottom>
          {title}
        </Typography> */}
        <Grid container spacing={2} justify='center'>
          <Grid item>
            <Avatar className={classes.largeAvatar}>H</Avatar>
          </Grid>
          <Grid item>
            {/* <Typography>{description}</Typography> */}
            {description}
          </Grid>
        </Grid>
        <Box mb={2} />
        <Grid container spacing={8} justify='center'>
          {socials.map((social) => (
            <Grid item>
              <Link target='_blank' rel='noopener' href={social.url} key={social.name}>
                {social.name === 'Twitter' ? (
                  <TwitterIcon style={{ fontSize: 40 }} />
                ) : (
                  <GitHubIcon style={{ fontSize: 40 }} />
                )}
              </Link>
            </Grid>
          ))}
        </Grid>
      </Paper>
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
