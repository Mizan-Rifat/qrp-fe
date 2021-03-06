import React, { useState } from 'react';
import { ListItem, ListItemText, ListItemAvatar, makeStyles } from '@material-ui/core';
import Avatar from './Avatar';
import dayjs from 'dayjs';
import Parse from 'parse';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  listItem: {
    justifyContent: 'flex-end'
  },
  listItemText: {
    textAlign: ({ isIncoming }) => (isIncoming ? 'left' : 'right')
  },
  listItemTextPrimary: {
    maxWidth: '65%',
    wordBreak: 'break-word',
    display: 'inline-block',
    justifyContent: 'flex-end',
    flex: 'unset',
    // border: '1px solid',
    padding: 8,
    borderRadius: ({ isIncoming }) => (isIncoming ? '0 8px 8px 8px' : '8px 0 8px 8px'),
    background: ({ isIncoming }) =>
      isIncoming ? theme.palette.info.light : theme.palette.primary.main,
    color: '#fff',
    textAlign: 'left'
  },
  listItemTextSecondary: {
    fontSize: 12,
    marginTop: 5
  },
  image: {
    height: 150,
    width: 250,
    borderRadius: ({ isIncoming }) => (isIncoming ? '0 8px 8px 8px' : '8px 0 8px 8px'),
    objectFit: 'cover',
    objectPosition: 'center'
  }
}));

const Message = ({ message, receiver }) => {
  const [online, setOnline] = useState(true);
  const [currentUser] = useState(Parse.User.current());

  const { contacts } = useSelector(state => state.contacts);

  const checkOnline = uid => contacts.find(contact => contact.id === uid)?.online;

  const senderId = message.messageFrom.id ? message.messageFrom.id : message.messageFrom.objectId;
  const isIncoming = currentUser.id !== senderId;

  const classes = useStyles({ isIncoming, badgeColor: online ? 'warning' : 'secondary' });

  return (
    <ListItem alignItems="flex-start" className={classNames({ [classes.listItem]: !isIncoming })}>
      {isIncoming && (
        <ListItemAvatar>
          <Avatar online={checkOnline(message.messageFrom.id)} />
        </ListItemAvatar>
      )}
      <div className="">
        {message.attachment && <img src={message.attachment} alt="" className={classes.image} />}
        <ListItemText
          classes={{
            root: classes.listItemText,
            primary: message.message && classes.listItemTextPrimary,
            secondary: classes.listItemTextSecondary
          }}
          primary={message.message}
          secondary={`${isIncoming ? receiver.firstName : currentUser.get('firstName')}, ${dayjs(
            message.createdAt
          ).format('hh:mm A, MMM DD')}`}
        />
      </div>
    </ListItem>
  );
};

export default Message;
