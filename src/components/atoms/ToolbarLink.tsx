import React from 'react';
import Link, { LinkProps } from '@material-ui/core/Link';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbarLink: {
      padding: theme.spacing(1),
      flexShrink: 0,
    },
  })
);

interface Props extends LinkProps {
  title: string;
  url: string;
}

const ToolbarLink: React.FC<Props> = ({ title, url, ...rest }) => {
  const classes = useStyles();
  return (
    <Link color='inherit' noWrap key={title} variant='body2' href={url} className={classes.toolbarLink} {...rest}>
      {title}
    </Link>
  );
};

export default ToolbarLink;
