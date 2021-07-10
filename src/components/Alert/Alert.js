import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog({
  open,
  setOpen,
  message = 'Are you sure to perform this action?',
  closeBtnLabel = 'Cancel',
  okBtnLabel = 'OK',
  handleAgree
}) {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{message}</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {closeBtnLabel}
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            handleAgree();
          }}
          color="primary"
          autoFocus
        >
          {okBtnLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
