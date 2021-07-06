import React, { useState, useRef } from 'react';
import { Grid, TextField, Fab, Box } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import Parse from 'parse';
import { useDispatch } from 'react-redux';
import { receiveMessage } from 'redux/ducks/messagesDuck';

export const MessageForm = ({ currentUser, receiver, channel }) => {
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const ref = useRef();

  const handleSubmit = async e => {
    e.preventDefault();

    if (message.trim() !== '') {
      ref.current.blur();

      const Messages = Parse.Object.extend('Messages');
      const msg = new Messages();

      msg.set('messageTo', receiver);
      msg.set('messageFrom', currentUser);
      msg.set('message', message);
      msg.set('seen', false);
      msg.set('channel', channel.name);

      msg.save().then(res => {
        setMessage('');
        dispatch(receiveMessage(res));
      });
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

  return (
    <Box p={1}>
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={11}>
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
            />
          </Grid>
          <Grid xs={1} align="right" style={{ padding: '8px 0' }}>
            <Fab color="primary" aria-label="add" size="small" type="submit">
              <SendIcon />
            </Fab>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
