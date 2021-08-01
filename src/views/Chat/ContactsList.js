import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts } from 'redux/ducks/contactsDuck';
import { Badge, Box, CircularProgress, ListItemSecondaryAction } from '@material-ui/core';
import { Loading } from 'components/Loading/Loading';

const useStyles = makeStyles(theme => ({
  secondary: {
    fontSize: 12,
    fontWeight: ({ unseenCount }) => (unseenCount ? 700 : 300)
  }
}));

const ContactList = ({ rid, setRid, setShow }) => {
  const classes = useStyles();
  const { contacts, fetching } = useSelector(state => state.contacts);

  const dispatch = useDispatch();

  // useEffect(async () => {
  //   dispatch(fetchContacts());
  // }, []);

  return (
    <List style={{ height: '100%', position: 'relative' }}>
      {fetching ? (
        <Loading position={{ top: '20%', left: '50%' }} />
      ) : (
        contacts.map(user => (
          <SingleListItem user={user} rid={rid} setRid={setRid} setShow={setShow} />
        ))
      )}
    </List>
  );
};

export default ContactList;

export const SingleListItem = ({ user, rid, setRid, setShow }) => {
  const classes = useStyles({ unseenCount: user.unseenCount });
  const handleClick = () => {
    setRid(user.id);
    setShow(false);
  };
  return (
    <ListItem button selected={user.id === rid} key={user.username} onClick={handleClick}>
      <ListItemIcon>
        <Avatar online={user.online} src={user.profilePicture} />
      </ListItemIcon>
      <ListItemText
        classes={{ secondary: classes.secondary }}
        primary={user.firstName}
        secondary={user.lastMessage?.message}
        secondaryTypographyProps={{ noWrap: true }}
      />

      <ListItemSecondaryAction>
        <Badge badgeContent={user.unseenCount} color="secondary" />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
