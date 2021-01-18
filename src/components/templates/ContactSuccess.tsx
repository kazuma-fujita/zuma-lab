import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import DescriptionTypography from 'components/atoms/DescriptionTypography';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(4),
      margin: 'auto',
      // PCサイズ時
      [theme.breakpoints.up('sm')]: {
        width: '70%',
      },
      // Mobileサイズ時
      [theme.breakpoints.down('sm')]: {
        width: '90%',
      },
    },
    content: {
      // 上下margin
      margin: theme.spacing(4, 0, 8, 0),
      // 以下中央揃え
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1ch',
    },
  })
);

const ContactSuccess: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant='h3' gutterBottom>
        お問い合わせありがとうございます
      </Typography>
      <div className={classes.content}>
        <DescriptionTypography>
          {`回答についてはご入力頂いたメールアドレス宛に連絡させて頂きます。\n回答までにお時間頂きますことご了承ください。`}
        </DescriptionTypography>
      </div>
    </div>
  );
};

export default ContactSuccess;
