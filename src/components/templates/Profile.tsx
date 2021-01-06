import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

// interface Props {
// }

//const Profile: React.FC<Props> = () => {
const Profile: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={5} className={classes.mainGrid}>
      <Grid item xs={12} md={8}>
        ここにProfileが入る
      </Grid>
    </Grid>
  );
};

export default Profile;
