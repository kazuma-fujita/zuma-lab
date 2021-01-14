import React from 'react';
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      display: 'flex',
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.8, 0.8, 0.8, 0),
      },
    },
    button: {
      textTransform: 'none',
    },
  })
);

interface Props {
  tags: Array<string>;
}

const TagButtons: React.FC<Props> = ({ tags }) => {
  const classes = useStyles();
  return (
    <div className={classes.chip}>
      {tags.map((tag) => (
        <Button
          size='small'
          variant='outlined'
          color='primary'
          href={`/tags/${tag}`}
          key={tag}
          className={classes.button}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

export default TagButtons;
