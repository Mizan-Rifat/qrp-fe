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

const useStyles = makeStyles({});

const Chat = ({ setRid }) => {
  const classes = useStyles();
  const { contacts, fetching } = useSelector(state => state.contacts);

  const dispatch = useDispatch();
  useEffect(async () => {
    dispatch(fetchContacts());
  }, []);
  return (
    <List>
      {contacts.map(user => (
        <ListItem button key={user.username} onClick={() => setRid(user.id)}>
          <ListItemIcon>
            <Avatar online={user.online} src={user.profilePicture} />
          </ListItemIcon>
          <ListItemText primary={user.firstName}></ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default Chat;
