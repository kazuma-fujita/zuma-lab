import MuiAlert from '@material-ui/lab/Alert';
import React from 'react';

interface Props {
  children: string;
}

const ErrorAlert: React.FC<Props> = (props: Props) => (
  <MuiAlert severity='error' elevation={0} variant='filled' {...props} />
);

export default ErrorAlert;
