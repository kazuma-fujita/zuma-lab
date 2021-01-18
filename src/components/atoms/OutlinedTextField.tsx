import { makeStyles, TextFieldProps, Theme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),

    '& .MuiFormHelperText-root': {
      margin: 0,
    },
  },
}));

const OutlinedTextField: React.FC<TextFieldProps> = (props) => {
  const { margin, ...rest } = props;
  const classes = useStyles();

  return (
    <TextField className={classes.root} variant='outlined' margin={margin ? margin : 'normal'} fullWidth {...rest} />
  );
};

export default OutlinedTextField;
