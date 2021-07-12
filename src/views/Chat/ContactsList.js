import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts } from 'redux/ducks/contactsDuck';

const useStyles = makeStyles({});

const ContactList = ({ rid, setRid }) => {
  const classes = useStyles();
  const { contacts, fetching } = useSelector(state => state.contacts);

  const dispatch = useDispatch();
  useEffect(async () => {
    dispatch(fetchContacts());
  }, []);
  return (
    <List>
      {contacts.map(user => (
        <ListItem
          button
          selected={user.id === rid}
          key={user.username}
          onClick={() => setRid(user.id)}
        >
          <ListItemIcon>
            <Avatar online={user.online} src={user.profilePicture} />
          </ListItemIcon>
          <ListItemText primary={user.firstName}></ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default ContactList;
