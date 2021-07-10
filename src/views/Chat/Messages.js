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
import Chat from './Chat';
import { setPresenceStatus } from 'redux/ducks/contactsDuck';
import usePresence from 'hooks/usePresence';

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

const Messages = () => {
  const classes = useStyles();

  const [rid, setRid] = useQueryState('rid', '');

  const { currentUser } = usePresence();

  // useEffect(async () => {
  //   const res = await Parse.Cloud.run('update-commission', {
  //     commission: 20
  //   });

  //   console.log({ res });
  // }, []);

  return (
    <div>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar online={true} src={currentUser.get('profilePicture')} />
              </ListItemIcon>
              <ListItemText primary={currentUser.get('firstName')}></ListItemText>
            </ListItem>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: '10px' }}>
            <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
          </Grid>
          <Divider />
          <ContactsList setRid={setRid} />
        </Grid>
        <Grid item xs={9}>
          {rid === '' ? (
            <Box
              height="100%"
              width="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h6" gutterBottom>
                QRP Consulting
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Select a contact to start chat...
              </Typography>
            </Box>
          ) : (
            <Chat rid={rid} />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Messages;
