import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, CircularProgress, InputAdornment } from '@material-ui/core';
import Parse from 'parse';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import useNotify from 'hooks/useNotify';

const useStyles = makeStyles({
  disable: {
    pointerEvents: 'none',
    opacity: 0.5
  }
});

export default function DeleteDialog({ open, setOpen }) {
  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const toast = useNotify();

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Set Commission</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates
          occasionally.
        </DialogContentText> */}
          <TextField
            margin="dense"
            id="name"
            label="Commission"
            type="text"
            fullWidth
            value={commission}
            onChange={e => setCommission(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
            className={classNames({ [classes.disable]: loading })}
          />
          {loading && (
            <Box position="absolute" top="40%" left="42%">
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSetCommission} color="primary">
            Set
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
