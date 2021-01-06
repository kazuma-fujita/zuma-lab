import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from 'components/organisms/Header';
import Footer from 'components/organisms/Footer';
import Head from 'next/head';
import { SITE_TITLE } from 'lib/constants';
import { Container } from '@material-ui/core';
import { useFetchSNSList } from 'state/SNS/hooks';

const sections = [
  { title: 'Home', url: '/' },
  { title: 'Profile', url: '/profile' },
  // { title: 'Contact', url: '#' },
];

interface Props {
  title: string;
}

const Layout: React.FC<Props> = ({ title, children }) => {
  const socials = useFetchSNSList();
  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <title>{title}</title>
        <meta name='description' content='Learn how to build a personal website using Next.js' />
        <meta
          property='og:image'
          content={`https://og-image.now.sh/${encodeURI(
            title
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name='og:title' content={title} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <CssBaseline />
      <Container maxWidth='lg'>
        <Header title={SITE_TITLE} sections={sections} socials={socials} />
        <main>{children}</main>
      </Container>
      <Footer title={SITE_TITLE} />
    </>
  );
};

export default Layout;
