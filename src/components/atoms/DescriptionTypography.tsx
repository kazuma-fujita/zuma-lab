import React from 'react';
import { createStyles, makeStyles, Theme, Typography, TypographyProps } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    lineHeight: {
      lineHeight: theme.spacing(0.3),
    },
  })
);

const insertLineFeed = (line: React.ReactNode) =>
  typeof line === 'string' && line.indexOf('\n')
    ? line.split('\n').map((str, key) => (
        <span key={key}>
          {str}
          <br />
        </span>
      ))
    : line;

const DescriptionTypography: React.FC<TypographyProps> = ({ children, ...rest }) => {
  const classes = useStyles();
  return (
    <Typography variant='body1' className={classes.lineHeight} {...rest}>
      {insertLineFeed(children)}
    </Typography>
  );
};

export default DescriptionTypography;
