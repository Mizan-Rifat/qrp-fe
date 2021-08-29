import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

export default function CustomizedInputBase({ placeholder, title, handleSubmit }) {
  const classes = useStyles();
  const [value, setvalue] = useState('');
  const onSubmit = e => {
    e.preventDefault();
    handleSubmit(value);
  };

  return (
    <Paper component="form" className={classes.root} onSubmit={onSubmit}>
      <InputBase
        fullWidth
        className={classes.input}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search google maps' }}
        value={value}
        onChange={e => setvalue(e.target.value)}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.iconButton}
        aria-label="search"
      >
        {title}
      </Button>
    </Paper>
  );
}
