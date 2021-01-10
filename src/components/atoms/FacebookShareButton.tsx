import React from 'react';
import { Button } from '@material-ui/core';
import FacebookIcon from '@material-ui/icons/Facebook';
import { OverridableTypeMap, OverrideProps } from '@material-ui/core/OverridableComponent';

interface Props extends OverrideProps<OverridableTypeMap, React.ElementType> {
  url: string;
}

const FacebookShareButton: React.FC<Props> = ({ url, variant, startIcon, size, target, rel, ...rest }) => (
  <Button
    variant='outlined'
    size='small'
    startIcon={<FacebookIcon />}
    href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
    target='_blank'
    rel='nofollow noopener noreferrer'
    {...rest}
  >
    Share
  </Button>
);

export default FacebookShareButton;
