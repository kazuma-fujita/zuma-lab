import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import { AvatarItem } from 'interfaces/AvatarItem';
import DescriptionTypography from 'components/atoms/DescriptionTypography';
import { Box, CardMedia, Chip, Container, Divider, Grid, Link, Slider, Typography } from '@material-ui/core';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import { SNSItem } from 'interfaces/SNSItem';
import { ProfileDescriptionItem } from '../../interfaces/ProfileDescriptionItem';

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

interface Props {
  avatar: AvatarItem;
  socials: Array<SNSItem>;
  descriptions: Array<ProfileDescriptionItem>;
}
const Profile: React.FC<Props> = ({ avatar, socials, descriptions }) => {
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
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image='/images/profile/web-skill-image.jpeg'
                title='Web skill image'
              />
              <CardContent>
                <Typography gutterBottom variant='h6' component='h3'>
                  Web skills
                </Typography>
                <Divider />
                <Box m={3} />
                <Typography gutterBottom>React</Typography>
                <Slider defaultValue={60} disabled valueLabelDisplay='on' />
                <Typography gutterBottom>TypeScript</Typography>
                <Slider defaultValue={60} disabled valueLabelDisplay='on' />
                <Typography gutterBottom>Next</Typography>
                <Slider defaultValue={20} disabled valueLabelDisplay='on' />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image='/images/profile/mobile-skill-image.jpeg'
                title='mobile skill image'
              />
              <CardContent>
                <Typography gutterBottom variant='h6' component='h3'>
                  Mobile skills
                </Typography>
                <Divider />
                <Box m={3} />
                <Typography gutterBottom>Swift</Typography>
                <Slider defaultValue={60} disabled valueLabelDisplay='on' />
                <Typography gutterBottom>Kotlin</Typography>
                <Slider defaultValue={60} disabled valueLabelDisplay='on' />
                <Typography gutterBottom>Flutter</Typography>
                <Slider defaultValue={30} disabled valueLabelDisplay='on' />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image='/images/profile/backend-skill-image.jpeg'
                title='backend skill image'
              />
              <CardContent>
                <Typography gutterBottom variant='h6' component='h3'>
                  Backend skills
                </Typography>
                <Divider />
                <Box m={3} />
                <Typography gutterBottom>NodeJS</Typography>
                <Slider defaultValue={50} disabled valueLabelDisplay='on' />
                <Typography gutterBottom>Amplify</Typography>
                <Slider defaultValue={50} disabled valueLabelDisplay='on' />
                <Typography gutterBottom>DynamoDB</Typography>
                <Slider defaultValue={40} disabled valueLabelDisplay='on' />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image='/images/profile/other-skill-image.jpeg'
                title='Other skill image'
              />
              <CardContent>
                <Typography gutterBottom variant='h6' component='h3'>
                  Other skills
                </Typography>
                <Divider />
                <Box m={3} />
                <div className={classes.chip}>
                  <Chip label='Django' />
                  <Chip label='MySQL' />
                  <Chip label='Apache' />
                  <Chip label='Nginx' />
                  <Chip label='Git' />
                  <Chip label='Github' />
                  <Chip label='Docker' />
                  <Chip label='Cypress' />
                  <Chip label='Slack' />
                  <Chip label='Discode' />
                  <Chip label='Trello' />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image='/images/profile/aws-skill-image.jpeg'
                title='AWS skill image'
              />
              <CardContent>
                <Typography gutterBottom variant='h6' component='h3'>
                  AWS skills
                </Typography>
                <Divider />
                <Box m={3} />
                <div className={classes.chip}>
                  <Chip label='ElasticBeanstalk' />
                  <Chip label='EC2' />
                  <Chip label='ALB' />
                  <Chip label='RDS' />
                  <Chip label='Elasticsearch' />
                  <Chip label='S3' />
                  <Chip label='CloudFront' />
                  <Chip label='Route53' />
                  <Chip label='ACM' />
                  <Chip label='CloudWatch' />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image='/images/profile/studying-skill-image.jpeg'
                title='studying skill image'
              />
              <CardContent>
                <Typography gutterBottom variant='h6' component='h3'>
                  Studying skills
                </Typography>
                <Divider />
                <Box m={3} />
                <div className={classes.chip}>
                  <Chip label='CDK' />
                  <Chip label='Lambda' />
                  <Chip label='Cognito' />
                  <Chip label='AppSync' />
                  <Chip label='CloudFormation' />
                  <Chip label='ECS' />
                  <Chip label='ECR' />
                  <Chip label='SMS' />
                  <Chip label='SES' />
                  <Chip label='DeviceFarm' />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image='/images/profile/music-skill-image.jpeg'
                title='music skill image'
              />
              <CardContent>
                <Typography gutterBottom variant='h6' component='h3'>
                  Music play skills
                </Typography>
                <Divider />
                <Box m={3} />
                <div className={classes.chip}>
                  <Chip label='Guitar' />
                  <Chip label='Banjo' />
                  <Chip label='Mandolin' />
                  <Chip label='Bass' />
                  <Chip label='Fiddle' />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image='/images/profile/hobby-skill-image.jpeg'
                title='hobby skill image'
              />
              <CardContent>
                <Typography gutterBottom variant='h6' component='h3'>
                  Hobby
                </Typography>
                <Divider />
                <Box m={3} />
                <div className={classes.chip}>
                  <Chip label='Music' />
                  <Chip label='Rock festival' />
                  <Chip label='Camp' />
                  <Chip label='Road bike' />
                </div>
              </CardContent>
            </Card>
          </Grid>
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
                    <Link target='_blank' rel='noopener' href={social.url} key={social.name}>
                      {social.name === 'Twitter' ? (
                        <TwitterIcon style={{ fontSize: 40 }} />
                      ) : (
                        <GitHubIcon style={{ fontSize: 40 }} />
                      )}
                    </Link>
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
