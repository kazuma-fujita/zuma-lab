import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from 'components/organisms/Header';
import Footer from 'components/organisms/Footer';
import Head from 'next/head';
import { SITE_TITLE } from 'lib/constants';
import { Container } from '@material-ui/core';
import { useFetchSNSList } from 'state/SNS/hooks';
import { useScrollToTop } from 'lib/useScrollToTop';

const sections = [
  { title: 'Home', url: '/' },
  { title: 'Profile', url: '/profile' },
  // { title: 'Contact', url: '#' },
];

interface Props {
  title: string;
  metaDescription: string;
}

const Layout: React.FC<Props> = ({ title, metaDescription, children }) => {
  const socials = useFetchSNSList();
  const { ref, scrollToTop } = useScrollToTop();
  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <title>{title}</title>
        <meta name='description' content={metaDescription} />
        {/* <meta
          property='og:image'
          content={`https://og-image.now.sh/${encodeURI(
            title
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        /> */}
        <meta
          property='og:image'
          content={`https://ogi-api.vercel.app/${encodeURI(
            title
          )}.png?md=0&fontSize=75px&background=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1445375011782-2384686778a0`}
        />
        <meta name='og:title' content={title} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <CssBaseline />
      {/* Topへ戻るボタンクリック時この位置まで画面スクロール */}
      <div id='top-of-screen' ref={ref} />
      <Container maxWidth='lg'>
        <Header title={SITE_TITLE} sections={sections} socials={socials} />
        <main>{children}</main>
      </Container>
      <Footer title={SITE_TITLE} sections={sections} scrollToTop={scrollToTop} />
    </>
  );
};

export default Layout;
