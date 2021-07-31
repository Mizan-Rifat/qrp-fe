import React, { useState, useRef } from 'react';
import { Grid, TextField, Fab, Box, IconButton, makeStyles } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import Parse from 'parse';
import { useDispatch } from 'react-redux';
import { receiveMessage } from 'redux/ducks/messagesDuck';
import AttachmentIcon from '@material-ui/icons/Attachment';
import bgImage from 'assets/img/sidebar-2.jpg';
import CloseIcon from '@material-ui/icons/Close';
import useNotify from '../../hooks/useNotify';

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15
  }
}));

export const MessageForm = ({ currentUser, receiver, channel }) => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const toast = useNotify();
  const dispatch = useDispatch();

  const ref = useRef();

  const handleSubmit = async e => {
    e.preventDefault();

    if (message.trim() !== '' || attachment) {
      console.log('sds');
      ref.current.blur();

      const Messages = Parse.Object.extend('Messages');
      const msg = new Messages();

      msg.set('messageTo', receiver);
      msg.set('messageFrom', currentUser);
      msg.set('message', message);
      msg.set('seen', false);
      msg.set('channel', channel.name);

      if (attachment) {
        let name = attachment.name;
        name = name.replace(/[ ,]+/g, '-');
        console.log({ name });
        const parseFile = new Parse.File(name, attachment);

        try {
          await parseFile.save();
        } catch (error) {
          console.log({ error });
          toast(error.message, 'error');
          return;
        }

        console.log(parseFile._url);
        msg.set('attachment', parseFile._url);
      }

      const response = await msg.save().catch(err => {
        console.log({ err });
      });
      setMessage('');
      setAttachment(null);
      dispatch(receiveMessage({ id: response.id, ...response.attributes }));
    }
  };

  const handleFocus = () => {
    channel.trigger('client-typing', {
      typing: true
    });
  };

  const handleBlur = () => {
    channel.trigger('client-typing', {
      typing: false
    });
  };

  const handleUploadChange = e => {
    // setAttachment(URL.createObjectURL(e.target.files[0]));
    setAttachment(e.target.files[0]);
  };

  return (
    <Box p={1} position="relative">
      {attachment && (
        <Box
          border={0.5}
          borderColor="grey.300"
          height={150}
          position="absolute"
          top={-168}
          left={0}
          p={1}
        >
          <img src={URL.createObjectURL(attachment)} alt="" height={150} />
          <Fab
            size="small"
            color="secondary"
            disableRipple
            className={classes.closeButton}
            onClick={() => setAttachment(null)}
          >
            <CloseIcon />
          </Fab>
        </Box>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={0} alignItems="center">
          <Grid xs={1} item container justify="center">
            <input
              accept="image/*"
              className={classes.input}
              id="icon-button-file"
              type="file"
              style={{ display: 'none' }}
              onChange={handleUploadChange}
            />
            <label htmlFor="icon-button-file">
              <IconButton color="primary" component="span">
                <AttachmentIcon />
              </IconButton>
            </label>
          </Grid>
          <Grid item xs={10}>
            <TextField
              id="outlined-basic-email"
              label="Type Something"
              fullWidth
              value={message}
              onChange={e => setMessage(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoComplete="off"
              inputRef={ref}
              variant="filled"
              size="small"
            />
          </Grid>
          <Grid xs={1} item container justify="center">
            <Fab color="primary" aria-label="add" size="small" type="submit">
              <SendIcon />
            </Fab>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
