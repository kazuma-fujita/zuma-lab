import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import DescriptionTypography from 'components/atoms/DescriptionTypography';
import { Divider, Typography } from '@material-ui/core';
import { PrivacyProps } from 'interfaces/PrivacyProps';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    description: {
      margin: 'auto',
      lineHeight: theme.spacing(4),
      // PCサイズ時
      [theme.breakpoints.up('sm')]: {
        width: '70%',
      },
      // Mobileサイズ時
      [theme.breakpoints.down('sm')]: {
        width: '90%',
      },
    },
  })
);

const Privacy: React.FC<PrivacyProps> = ({ privacies }) => {
  const classes = useStyles();

  return (
    <div className={classes.description}>
      <Typography variant='h3' gutterBottom>
        プライバシーポリシー
      </Typography>
      {privacies.map(({ caption, description }) => (
        <div key={caption}>
          <Typography variant='h6' gutterBottom>
            {caption}
          </Typography>
          <Divider />
          <DescriptionTypography>{description}</DescriptionTypography>
        </div>
      ))}
    </div>
  );
};

export default Privacy;
