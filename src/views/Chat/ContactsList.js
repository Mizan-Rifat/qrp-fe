import React, { useRef, useEffect, useState, useContext } from 'react';
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
import { MessageContext } from './Messages';

const useStyles = makeStyles(theme => ({
  secondary: {
    fontSize: 12,
    fontWeight: ({ unseenCount }) => (unseenCount ? 700 : 300)
  }
}));

const ContactsList = () => {
  const classes = useStyles();
  const { contacts, fetching } = useSelector(state => state.contacts);

  return (
    <List style={{ height: '100%', position: 'relative' }}>
      {fetching ? (
        <Loading position={{ top: '20%', left: '50%' }} />
      ) : (
        contacts.map(user => <SingleListItem user={user} />)
      )}
    </List>
  );
};

export default ContactsList;

export const SingleListItem = ({ user }) => {
  const { setOpenDialog, rid, setRid } = useContext(MessageContext);
  const classes = useStyles({ unseenCount: user.unseenCount });
  const handleClick = () => {
    setRid(user.id);
    setOpenDialog(false);
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
