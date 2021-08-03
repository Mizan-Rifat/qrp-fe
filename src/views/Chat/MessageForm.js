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
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15
  },
  disable: {
    pointerEvents: 'none',
    opacity: 0.5
  }
}));

export const MessageForm = ({ currentUser, receiver, channel }) => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const toast = useNotify();
  const dispatch = useDispatch();

  const ref = useRef();

  const submitForm = async data => {
    const { receiver, currentUser, message, channel, attachment } = data;

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

      await parseFile.save().catch(err => {
        console.log({ err });
        return Promise.reject(err);
      });
      msg.set('attachment', parseFile?._url);
    }

    const response = await msg.save().catch(err => {
      console.log({ err });
      return Promise.reject(err);
    });

    return Promise.resolve(response);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (message.trim() !== '' || attachment) {
      setLoading(true);
      ref.current.blur();

      const response = await submitForm({
        receiver,
        currentUser,
        message,
        channel,
        attachment
      }).catch(err => {
        console.log({ err });
        if (err.code !== 130) {
          toast(err.message, 'error');
        } else {
          toast(err.message.code, 'error');
        }
        setLoading(false);
      });

      console.log({ response });

      if (response) {
        if (!receiver.get('online') && receiver.get('deviceId')) {
          const messages = Parse.Cloud.run('sendPush', {
            include_player_ids: receiver.get('deviceId'),
            heading: `${currentUser.get('firstName')} ${currentUser.get(
              'lastName'
            )} send you a message.`,
            message,
            type: 'message'
          });
        }

        setMessage('');
        setAttachment(null);
        dispatch(receiveMessage({ id: response.id, ...response.attributes }));
      }

      setLoading(false);
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
      <form onSubmit={handleSubmit} className={classNames({ [classes.disable]: loading })}>
        <Grid container spacing={0} alignItems="center">
          <Grid xs={2} sm={1} item container justify="center">
            <input
              accept="image/*"
              className={classes.input}
              id="icon-button-file"
              type="file"
              style={{ display: 'none' }}
              onChange={handleUploadChange}
            />
            <label htmlFor="icon-button-file">
              <IconButton color="primary" component="span" size="small">
                <AttachmentIcon />
              </IconButton>
            </label>
          </Grid>
          <Grid item xs={8} sm={10}>
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
          <Grid xs={2} sm={1} item container justify="center">
            <Fab color="primary" aria-label="add" size="small" type="submit">
              <SendIcon />
            </Fab>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
