import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import DescriptionTypography from 'components/atoms/DescriptionTypography';
import { Box, CardMedia, Container, Divider, Grid, Slider, Typography } from '@material-ui/core';
import SocialLinkIcon from 'components/molecules/SocialLinkIcon';
import Chips from 'components/molecules/Chips';
import { ProfileProps } from 'interfaces/ProfileProps';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatarCard: {
      // maxWidth: 800,
      margin: 'auto',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4),
      // PCサイズ時
      [theme.breakpoints.up('sm')]: {
        width: '40%',
      },
      // Mobileサイズ時
      [theme.breakpoints.down('sm')]: {
        width: '90%',
      },
    },
    largeAvatar: {
      width: theme.spacing(8),
      height: theme.spacing(8),
    },
    cardGrid: {
      // paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    media: {
      height: 140,
    },
    chip: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.3),
      },
    },
    social: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        marginTop: theme.spacing(4),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
      },
    },
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

const Profile: React.FC<ProfileProps> = ({ avatar, socials, descriptions, mainSkills, subSkills }) => {
  const classes = useStyles();

  return (
    <>
      <Card variant='outlined' className={classes.avatarCard}>
        <CardHeader
          avatar={<Avatar className={classes.largeAvatar} src={avatar.image} />}
          title='ZUMA a.k.a. Kazuma'
          subheader='Web/Mobile App developer.'
        />
      </Card>
      <Container className={classes.cardGrid} maxWidth='md'>
        <Grid container spacing={4}>
          {mainSkills.map(({ title, image, imageTitle, skills }) => (
            <Grid item xs={12} sm={6} md={4} key={title}>
              <Card className={classes.card}>
                <CardMedia className={classes.media} image={image} title={imageTitle} />
                <CardContent>
                  <Typography gutterBottom variant='h6' component='h3'>
                    {title}
                  </Typography>
                  <Divider />
                  <Box m={3} />
                  {skills.map(({ skill, rate }) => (
                    <div key={skill}>
                      <Typography gutterBottom>{skill}</Typography>
                      <Slider defaultValue={rate} disabled valueLabelDisplay='on' />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
          {subSkills.map(({ title, image, imageTitle, skills }) => (
            <Grid item xs={12} sm={6} md={4} key={title}>
              <Card className={classes.card}>
                <CardMedia className={classes.media} image={image} title={imageTitle} />
                <CardContent>
                  <Typography gutterBottom variant='h6' component='h3'>
                    {title}
                  </Typography>
                  <Divider />
                  <Box m={3} />
                  <Chips tags={skills} key={title} />
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image='/images/profile/social-skill-image.jpeg'
                title='social skill image'
              />
              <CardContent>
                <Typography gutterBottom variant='h6' component='h3'>
                  Social Account
                </Typography>
                <Divider />
                <div className={classes.social}>
                  {socials.map((social) => (
                    <SocialLinkIcon name={social.name} url={social.url} largeIcon key={social.name} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <div className={classes.description}>
        {descriptions.map((item) => (
          <div key={item.caption}>
            <Typography variant='h6' gutterBottom>
              {item.caption}
            </Typography>
            <Divider />
            <DescriptionTypography>{item.description}</DescriptionTypography>
          </div>
        ))}
      </div>
    </>
  );
};

export default Profile;
