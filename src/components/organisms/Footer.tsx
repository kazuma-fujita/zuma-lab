import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Box, Fab } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { SectionItem } from 'interfaces/SectionItem';
import ToolbarLink from 'components/atoms/ToolbarLink';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    // marginTop: theme.spacing(8),
    padding: theme.spacing(6, 0),
    textAlign: 'center',
    // width: '100%',
    // position: 'absolute', // 画面下部固定
    // bottom: theme.spacing(0), // 画面下部余白ゼロ
  },
  fab: {
    position: 'absolute', // 画面下部固定
    bottom: theme.spacing(24), // 画面下部からのmargin
    right: theme.spacing(4), // 画面右からのmargin
    // PCサイズ時
    [theme.breakpoints.up('sm')]: {
      right: theme.spacing(16), // 画面右からのmargin
    },
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
}));

interface ScrollToTopProps {
  scrollToTop: () => void;
}

interface CopyrightProps {
  title: string;
}

interface Props extends CopyrightProps, ScrollToTopProps {
  sections: Array<SectionItem>;
}

const ScrollToTopButton: React.FC<ScrollToTopProps> = ({ scrollToTop }) => {
  const classes = useStyles();
  return (
    <Fab className={classes.fab} size='medium' color='primary' aria-label='add' onClick={scrollToTop}>
      <ExpandLessIcon />
    </Fab>
  );
};

const Copyright: React.FC<CopyrightProps> = ({ title }) => (
  <Typography variant='body2' color='textSecondary' align='center'>
    {'Copyright © '}
    <Link color='inherit' href='/'>
      {title}
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);

const Footer: React.FC<Props> = ({ title, sections, scrollToTop }) => {
  const classes = useStyles();

  return (
    <>
      <ScrollToTopButton scrollToTop={scrollToTop} />
      <footer className={classes.footer}>
        {sections.map(({ title, url }, index: number) => (
          <>
            <ToolbarLink title={title} url={url} />
            {sections.length === index + 1 || ' | '}
          </>
        ))}
        <Box m={4} />
        <Container maxWidth='lg'>
          <Copyright title={title} />
        </Container>
      </footer>
    </>
  );
};

export default Footer;
