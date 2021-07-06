import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import Message from './Message';
import Avatar from './Avatar';
import Parse from 'parse';
import Pusher from 'pusher-js';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Scrollbar from 'react-scrollbars-custom';
import { useQueryState } from 'react-router-use-location-state';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from 'redux/ducks/messagesDuck';
import useReciever from 'hooks/useReceiver';
import { MessageForm } from './MessageForm';
import { fetchContacts } from 'redux/ducks/contactsDuck';
import ContactsList from './ContactsList';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  chatSection: {
    width: '100%',
    height: '85vh'
  },
  headBG: {
    backgroundColor: '#e0e0e0'
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    // height: '75vh'
    // overflowY: 'auto'
  }
});

const Chat = ({ rid }) => {
  const classes = useStyles();

  const messageEndRef = useRef(null);
  const [currentUser] = useState(Parse.User.current());

  const { messages, fetching } = useSelector(state => state.messages);
  const dispatch = useDispatch();

  const { receiver, channel, events } = useReciever(rid);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      {fetching ? (
        <p>Loading...</p>
      ) : (
        <>
          <Scrollbar style={{ height: `calc(100% - 90px)` }}>
            <List className={classes.messageArea}>
              {messages.map((message, index) => (
                <Message message={message} index={index} />
              ))}
            </List>
            <div ref={messageEndRef} />
          </Scrollbar>
          <Box pt={3} position="relative">
            {events.typing && (
              <Box position="absolute" top={0} left={10} fontWeight={500} clone>
                <Typography variant="caption">Typing...</Typography>
              </Box>
            )}
            <Divider />
            <MessageForm receiver={receiver} currentUser={currentUser} channel={channel} />
          </Box>
        </>
      )}
    </>
  );
};

export default Chat;
