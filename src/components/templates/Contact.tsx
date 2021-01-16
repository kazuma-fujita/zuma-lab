import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import DescriptionTypography from 'components/atoms/DescriptionTypography';
import { Button, Divider, Typography } from '@material-ui/core';
import EmailTextField from 'components/atoms/EmailTextField';
import { ContactParams } from 'interfaces/ContactParams';
import { useForm } from 'react-hook-form';
import NameTextField from 'components/atoms/NameTextField';
import { useCallback } from 'react';
import ContactContentTextField from 'components/atoms/ContactContentTextField';

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
      margin: theme.spacing(4, 0, 8, 0),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1ch',
    },
  })
);

const Contact: React.FC = () => {
  // react-hooks-form v7系以降で eslint の unbound-method error が対応される予定
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors } = useForm<ContactParams>();

  const submit = useCallback((data: ContactParams) => {
    console.log(data);
  }, []);

  const classes = useStyles();
  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
      <div className={classes.root}>
        <Typography variant='h3' gutterBottom>
          お問い合わせ
        </Typography>
        <div className={classes.content}>
          <DescriptionTypography>
            お問い合わせは TwitterでDMして頂くか、こちらのフォームからご連絡ください。
          </DescriptionTypography>
          <NameTextField register={register} errorMessage={errors.name && errors.name.message} />
          <EmailTextField register={register} errorMessage={errors.email && errors.email.message} />
          <ContactContentTextField register={register} errorMessage={errors.content && errors.content.message} />
          <DescriptionTypography>
            プライバシーポリシーをご確認いただき、記載されている内容に関して同意の上お問い合わせください。
          </DescriptionTypography>
          <Button type='submit' variant='contained' color='primary' size='large'>
            お問い合わせする
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Contact;
