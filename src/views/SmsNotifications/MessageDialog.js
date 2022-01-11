import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, CircularProgress, Icon, TextField } from '@material-ui/core';
import Parse from 'parse';
import useNotify from 'hooks/useNotify';

const useStyles = makeStyles(theme => ({
  formDisable: {
    pointerEvents: 'none',
    opacity: 0.5
  }
}));

export default function MessageDialog({ data, open, setOpen }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const toast = useNotify();

  const handleClose = () => {
    setMessage('');
    setLoading(false);
    setOpen(false);
  };

  const handleSend = async () => {
    const phoneNumbers = data.map(item => item.phone);
    setLoading(true);
    const res = await Parse.Cloud.run('sendMessageToPharmacists', {
      phoneNumbers,
      message
    }).catch(err => {
      setLoading(false);
      toast(err.message, 'error');
    });

    setMessage('');
    setLoading(false);
    setOpen(false);
    toast('Successfully sent.', 'success');
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
    >
      {loading && (
        <Box position="absolute" top="45%" left="47%">
          <CircularProgress />
        </Box>
      )}
      <DialogTitle id="max-width-dialog-title">Send SMS</DialogTitle>
      <DialogContent className={loading && classes.formDisable}>
        <TextField
          id="outlined-multiline-flexible"
          label="Type your message"
          multiline
          rows={3}
          value={message}
          onChange={e => setMessage(e.target.value)}
          variant="outlined"
          fullWidth
          inputProps={{ maxLength: 160 }}
        />
      </DialogContent>
      <DialogActions style={{ padding: '8px 24px 16px 24px' }}>
        <Button onClick={handleClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={<Icon>send</Icon>}
          onClick={handleSend}
          disabled={loading || message.trim() === ''}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}
