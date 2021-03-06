import React, { useRef, useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Message from './Message';
import Parse from 'parse';
import classNames from 'classnames';
import Scrollbar from 'react-scrollbars-custom';
import { useDispatch, useSelector } from 'react-redux';
import useReciever from 'hooks/useReceiver';
import { MessageForm } from './MessageForm';
import {
  Chip,
  CircularProgress,
  Grid,
  Hidden,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { loadMoreMessages } from 'redux/ducks/messagesDuck';
import VisibilitySensor from 'react-visibility-sensor';

import IconButton from '@material-ui/core/IconButton';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { setMessagesState } from 'redux/ducks/messagesDuck';
import { Loading } from 'components/Loading/Loading';
import { MessageContext } from './Messages';
import useNotify from 'hooks/useNotify';
import { fetchMessages } from 'redux/ducks/messagesDuck';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650
  },
  headBG: {
    backgroundColor: '#e0e0e0'
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    position: 'relative'
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
  },
  scrollbar: {
    height: `calc(100% - 90px) !important`,
    [theme.breakpoints.down('sm')]: {
      height: `calc(100% - 155px) !important`
    }
  }
}));

const Chat = () => {
  const classes = useStyles();
  const { setOpenDialog, rid } = useContext(MessageContext);
  const messageEndRef = useRef(null);
  const [currentUser] = useState(Parse.User.current());
  const toast = useNotify();

  const [page, setPage] = useState(1);
  const [visibility, setVisibility] = useState(true);

  const { messages, count, fetching, loading, error, channel, events, recipient } = useSelector(
    state => state.messages
  );

  const dispatch = useDispatch();

  useReciever(rid);

  const handleLodMore = () => {
    setPage(page + 1);
    dispatch(loadMoreMessages(rid, page + 1)).catch(err => {
      toast(err.message, 'error');
    });
  };

  const handleVisibilityChange = isVisible => {
    setVisibility(isVisible);
    if (isVisible) {
      dispatch(setMessagesState('events', { ...events, newMessage: false }));
    }
  };
  const handleNewMessage = () => {
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    dispatch(setMessagesState('events', { ...events, newMessage: false }));
  };

  useEffect(() => {
    if (messageEndRef.current && visibility) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    setPage(1);
    if (rid !== '') {
      dispatch(fetchMessages(rid, 1)).catch(err => {
        toast(err.message, 'error');
      });
    }
  }, [rid]);

  return (
    <>
      {fetching ? (
        <Box className={classes.disable} height="100%" position="relative">
          <Loading position={{ top: '50%', left: '50%' }} />
        </Box>
      ) : error ? (
        <Box height="100%" width="100%" display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h6" gutterBottom>
            No user found...
          </Typography>
        </Box>
      ) : (
        <>
          <Hidden mdUp>
            <Grid item xs={12}>
              <List>
                <ListItem button key="RemySharp" onClick={() => setOpenDialog(true)}>
                  <ListItemIcon>
                    <ArrowBackIosIcon />
                  </ListItemIcon>
                  {recipient.id && (
                    <ListItemText primary={`${recipient.firstName} ${recipient.lastName}`} />
                  )}
                </ListItem>
                <Divider />
              </List>
            </Grid>
          </Hidden>
          <Scrollbar className={classes.scrollbar}>
            {messages.length === 0 && (
              <Box textAlign="center" mt={8}>
                <p style={{ fontWeight: 400 }}>Start New Conversation...</p>
              </Box>
            )}
            <List className={classes.messageArea}>
              {count > messages.length && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <LoadMoreButton handleLodMore={handleLodMore} loading={loading} />
                </Box>
              )}
              {messages.map((message, index) =>
                index == messages.length - 3 ? (
                  <VisibilitySensor onChange={handleVisibilityChange} offset={{ top: -400 }}>
                    <Message message={message} receiver={recipient} />
                  </VisibilitySensor>
                ) : (
                  <Message message={message} receiver={recipient} />
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
            {events.newMessage && !visibility && (
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

            <MessageForm receiver={recipient} currentUser={currentUser} channel={channel} />
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
