import React from 'react';
import { Typography, TypographyProps } from '@material-ui/core';

const insertLineFeed = (line: React.ReactNode) =>
  typeof line === 'string' && line.indexOf('\n')
    ? line.split('\n').map((str, key) => (
        <span key={key}>
          {str}
          <br />
        </span>
      ))
    : line;

const DescriptionTypography: React.FC<TypographyProps> = ({ children, ...rest }) => (
  <Typography variant='body2' {...rest}>
    {insertLineFeed(children)}
  </Typography>
);

export default DescriptionTypography;
