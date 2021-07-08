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
import classNames from 'classnames';
import Scrollbar from 'react-scrollbars-custom';
import { useQueryState } from 'react-router-use-location-state';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from 'redux/ducks/messagesDuck';
import useReciever from 'hooks/useReceiver';
import { MessageForm } from './MessageForm';
import { fetchContacts } from 'redux/ducks/contactsDuck';
import ContactsList from './ContactsList';
import { Button, Chip, CircularProgress, LinearProgress } from '@material-ui/core';
import { loadMoreMessages } from 'redux/ducks/messagesDuck';
import VisibilitySensor from 'react-visibility-sensor';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

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
  },
  disable: {
    pointerEvents: 'none',
    opacity: 0.5
  },
  progress: {
    position: 'absolute',
    left: '42%',
    top: '5px',
    zIndex: 5
  }
});

const Chat = ({ rid }) => {
  const classes = useStyles();

  const messageEndRef = useRef(null);
  const [currentUser] = useState(Parse.User.current());

  const [page, setPage] = useState(1);
  const [visibility, setVisibility] = useState(true);

  const { messages, count, fetching, loading } = useSelector(state => state.messages);
  const dispatch = useDispatch();

  const { receiver, channel, events, newMessage, setNewMessage } = useReciever(rid);

  const handleLodMore = () => {
    setPage(page + 1);
    dispatch(loadMoreMessages(rid, page + 1));
  };

  const handleVisibilityChange = isVisible => {
    console.log({ isVisible });
    setVisibility(isVisible);
    if (isVisible) {
      setNewMessage(false);
    }
  };
  const handleNewMessage = () => {
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    setNewMessage(false);
  };

  useEffect(() => {
    if (messageEndRef.current && visibility) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    setPage(1);
  }, [rid]);

  return (
    <>
      {fetching ? (
        <p>Loading...</p>
      ) : (
        <>
          <Scrollbar style={{ height: `calc(100% - 90px)` }}>
            <List className={classes.messageArea}>
              {count > messages.length && (
                <Box display="flex" justifyContent="center" mt={3}>
                  {/* <Chip color="primary" size="small" label="Load More" onClick={handleLodMore} /> */}
                  <LoadMoreButton handleLodMore={handleLodMore} />
                </Box>
              )}
              {messages.map((message, index) =>
                // <Message message={message} index={index} />
                index == messages.length - 3 ? (
                  <VisibilitySensor onChange={handleVisibilityChange} offset={{ top: -400 }}>
                    <Message message={message} index={index} />
                  </VisibilitySensor>
                ) : (
                  <Message message={message} index={index} />
                )
              )}
            </List>

            <div ref={messageEndRef} />
          </Scrollbar>
          <Box pt={3} position="relative">
            {events.typing && (
              <Box position="absolute" top={0} left={10} fontWeight={500} clone>
                <Typography variant="caption">Typing...</Typography>
              </Box>
            )}
            {newMessage && !visibility && (
              <Box
                position="absolute"
                top={-30}
                left={'47%'}
                fontWeight={500}
                bgcolor="info.main"
                clone
              >
                <IconButton
                  aria-label="delete"
                  className={classes.margin}
                  onClick={handleNewMessage}
                >
                  <ArrowDownwardIcon fontSize="inherit" color="#fff" />
                </IconButton>
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

const LoadMoreButton = ({ loading, handleLodMore }) => {
  const classes = useStyles();

  return (
    <Box position="relative">
      <Chip
        color="primary"
        size="small"
        label="Load More"
        onClick={handleLodMore}
        className={classNames({ [classes.disable]: loading })}
      />
      {loading && <CircularProgress size={16} className={classes.progress} />}
    </Box>
  );
};
