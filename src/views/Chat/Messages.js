import React, { useState, createContext, useContext } from 'react';
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
import Avatar from './Avatar';
import { useQueryState } from 'react-router-use-location-state';
import ContactsList from './ContactsList';
import Chat from './Chat';
import Parse from 'parse';
import { Button, Hidden, Slide } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Scrollbar from 'react-scrollbars-custom';
import ContactListDrawer from './ContactListDrawer';

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
    borderRight: '1px solid #e0e0e0',
    height: '100%'
    // overflowY: 'scroll'
  }
});

export const MessageContext = createContext();

const Messages = () => {
  const classes = useStyles();

  const [rid, setRid] = useQueryState('rid', '');
  const [openDialog, setOpenDialog] = useState(false);

  const currentUser = Parse.User.current();

  const deleteMessage = async () => {
    const messages = await Parse.Cloud.run('destroy-message', {
      rid
    });
  };

  const { recipient } = useSelector(state => state.messages);

  return (
    <MessageContext.Provider value={{ rid, setRid, openDialog, setOpenDialog, currentUser }}>
      <Button onClick={deleteMessage}>Delete</Button>
      <Grid container component={Paper} className={classes.chatSection}>
        <Hidden smDown>
          <Grid item xs={3} className={classes.borderRight500}>
            <Contacts />
          </Grid>
        </Hidden>

        <Grid
          item
          xs={12}
          md={9}
          style={{ height: '100%', position: 'relative' }}
          id="appContainerDiv"
        >
          <ContactListDrawer />
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
              <Hidden mdUp>
                <Button variant="outlined" color="primary" onClick={() => setOpenDialog(true)}>
                  View Contacts
                </Button>
              </Hidden>
            </Box>
          ) : (
            <>
              <Chat currentUser={currentUser} rid={rid} setRid={setRid} />
            </>
          )}
        </Grid>
      </Grid>
    </MessageContext.Provider>
  );
};

export default Messages;

export const Contacts = () => {
  const { currentUser } = useContext(MessageContext);

  return (
    <>
      <List>
        <ListItem button key="RemySharp">
          <ListItemIcon>
            <Avatar online={true} />
          </ListItemIcon>
          <ListItemText primary={currentUser.get('firstName')}></ListItemText>
        </ListItem>
      </List>
      <Divider />
      <Grid item style={{ padding: '10px' }}>
        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
      </Grid>
      <Divider />
      <Scrollbar style={{ height: 'calc(100% - 165px)' }}>
        <ContactsList />
      </Scrollbar>
    </>
  );
};
