import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
// import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { SNSItem } from 'interfaces/SNSItem';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Grid } from '@material-ui/core';
import { SectionItem } from 'interfaces/SectionItem';
import ToolbarLink from 'components/atoms/ToolbarLink';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'flex-end',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
}));

interface Props {
  title: string;
  sections: Array<SectionItem>;
  socials: Array<SNSItem>;
}

const Header: React.FC<Props> = ({ title, sections, socials }) => {
  const classes = useStyles();
  return (
    <>
      <Toolbar className={classes.toolbar}>
        {/* <Button size="small">Subscribe</Button> */}
        <Typography component='h2' variant='h5' color='inherit' align='center' noWrap className={classes.toolbarTitle}>
          <Link color='inherit' href='/'>
            {title}
          </Link>
        </Typography>
        {/* <IconButton>
          <SearchIcon />
        </IconButton>
        <Button variant="outlined" size="small">
          Sign up
        </Button> */}
      </Toolbar>
      <Toolbar component='nav' variant='dense' className={classes.toolbarSecondary}>
        {sections.map(({ title, url }) => (
          <ToolbarLink title={title} url={url} />
        ))}
        <Grid container spacing={2} justify='flex-end'>
          {socials.map((social) => (
            <Grid item key={social.name}>
              <Link target='_blank' rel='noopener' href={social.url} key={social.name}>
                {social.name === 'Twitter' ? <TwitterIcon fontSize='small' /> : <GitHubIcon fontSize='small' />}
              </Link>
            </Grid>
          ))}
        </Grid>
      </Toolbar>
    </>
  );
};

export default Header;
