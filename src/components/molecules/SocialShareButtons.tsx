import React from 'react';
import TwitterShareButton from 'components/atoms/TwitterShareButton';
import FacebookShareButton from 'components/atoms/FacebookShareButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      '& > *': {
        margin: theme.spacing(2, 2, 2, 0),
      },
    },
    button: {
      fontSize: 8,
    },
  })
);

interface Props {
  title: string;
  url: string;
}

const SocialShareButtons: React.FC<Props> = ({ title, url }) => {
  const classes = useStyles();
  return (
    <div className={classes.margin}>
      <TwitterShareButton title={title} url={url} className={classes.button} />
      <FacebookShareButton title={title} url={url} className={classes.button} />
    </div>
  );
};

export default SocialShareButtons;
