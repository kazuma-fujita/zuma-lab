import React from 'react';
import { createStyles, Link, LinkProps, makeStyles } from '@material-ui/core';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';

const useStyles = makeStyles(() =>
  createStyles({
    icon: {
      fontSize: 40,
    },
  })
);

interface Props extends LinkProps {
  name: string;
  url: string;
  largeIcon?: boolean;
}

const SocialLinkIcon: React.FC<Props> = ({ name, url, largeIcon, ...rest }) => {
  const classes = useStyles();
  return (
    <Link target='_blank' rel='nofollow noopener noreferrer' href={url} key={name} {...rest}>
      {largeIcon ? (
        name === 'Twitter' ? (
          <TwitterIcon className={classes.icon} />
        ) : (
          <GitHubIcon className={classes.icon} />
        )
      ) : name === 'Twitter' ? (
        <TwitterIcon />
      ) : (
        <GitHubIcon />
      )}
    </Link>
  );
};

export default SocialLinkIcon;
