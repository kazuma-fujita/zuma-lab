import React from 'react';
import { Chip, createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      display: 'flex',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      '& > *': {
        // margin: theme.spacing(0.3),
        marginRight: theme.spacing(0.8),
      },
    },
    chipFontColor: {
      color: 'gray',
    },
  })
);

interface Props {
  tags: Array<string>;
}

const Chips: React.FC<Props> = ({ tags }) => {
  const classes = useStyles();
  return (
    <div className={classes.chip}>
      {tags.map((tag) => (
        <Chip variant='outlined' size='small' label={tag} className={classes.chipFontColor} />
      ))}
    </div>
  );
};

export default Chips;
