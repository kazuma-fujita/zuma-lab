import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    // marginTop: theme.spacing(8),
    padding: theme.spacing(6, 0),
  },
}));

interface Props {
  title: string;
}

const Footer: React.FC<Props> = ({ title }) => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth='lg'>
        <Copyright title={title} />
      </Container>
    </footer>
  );
};

const Copyright: React.FC<Props> = ({ title }) => (
  <Typography variant='body2' color='textSecondary' align='center'>
    {'Copyright © '}
    <Link color='inherit' href='/'>
      {title}
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);

export default Footer;
