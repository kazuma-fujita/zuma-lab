import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import DescriptionTypography from 'components/atoms/DescriptionTypography';
import { Box, Button, Link, Typography } from '@material-ui/core';
import EmailTextField from 'components/atoms/EmailTextField';
import { ContactParams } from 'interfaces/ContactParams';
import { useForm } from 'react-hook-form';
import NameTextField from 'components/atoms/NameTextField';
import { useCallback } from 'react';
import ContactContentTextField from 'components/atoms/ContactContentTextField';
import { SNSItem } from 'interfaces/SNSItem';
import { useSendContactForm } from 'state/contact/hooks';
import { useRouter } from 'next/router';
import ErrorAlert from 'components/atoms/ErrorAlert';

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

interface Props {
  socials: Array<SNSItem>;
}

const Contact: React.FC<Props> = ({ socials }) => {
  // react-hooks-form v7系以降で eslint の unbound-method error が対応される予定
  // https://github.com/react-hook-form/react-hook-form/issues/2887
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors } = useForm<ContactParams>();
  const router = useRouter();
  const { state, sendContactForm } = useSendContactForm();
  const submit = useCallback((data: ContactParams) => {
    console.log('postData:', data);
    void sendContactForm(data);
  }, []);

  const classes = useStyles();
  return (
    <>
      {/* {state.isSuccess && router.push('/contact_success')} */}
      {state.isSuccess && <ErrorAlert>成功</ErrorAlert>}
      <form noValidate onSubmit={handleSubmit(submit)}>
        <div className={classes.root}>
          <Typography variant='h3' gutterBottom>
            お問い合わせ
          </Typography>
          <div className={classes.content}>
            {state.errorMessage && <ErrorAlert>{state.errorMessage}</ErrorAlert>}
            <DescriptionTypography>
              お問い合わせは{' '}
              {socials.map(
                (social) =>
                  social.name === 'Twitter' && (
                    <Link target='_blank' rel='nofollow noopener noreferrer' href={social.url} key={social.name}>
                      {social.name}
                    </Link>
                  )
              )}{' '}
              にDMして頂くか、こちらのフォームからご連絡ください。
            </DescriptionTypography>
            <NameTextField register={register} errorMessage={errors.name && errors.name.message} />
            <EmailTextField register={register} errorMessage={errors.email && errors.email.message} />
            <ContactContentTextField register={register} errorMessage={errors.message && errors.message.message} />
            <DescriptionTypography>
              <Link href='/privacy'>プライバシーポリシー</Link>{' '}
              をご確認いただき、記載されている内容に関して同意の上お問い合わせください。
            </DescriptionTypography>
            <Box mb={2} />
            <Button type='submit' variant='contained' color='primary' size='large'>
              お問い合わせする
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Contact;
