import React from 'react';
import { Button } from '@material-ui/core';
import TwitterIcon from '@material-ui/icons/Twitter';
import { OverridableTypeMap, OverrideProps } from '@material-ui/core/OverridableComponent';

interface Props extends OverrideProps<OverridableTypeMap, React.ElementType> {
  title: string;
  url: string;
}

const TwitterShareButton: React.FC<Props> = ({ title, url, ...rest }) => (
  <Button
    variant='outlined'
    size='small'
    startIcon={<TwitterIcon />}
    href={`https://twitter.com/intent/tweet?text=${title}&url=${url}`}
    target='_blank'
    rel='nofollow noopener noreferrer'
    {...rest}
  >
    Share
  </Button>
);

export default TwitterShareButton;
