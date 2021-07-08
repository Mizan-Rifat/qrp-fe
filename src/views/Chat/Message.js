import React, { useState } from 'react';
import {
  ListItem,
  Grid,
  ListItemText,
  ListItemAvatar,
  // Avatar,
  makeStyles
} from '@material-ui/core';
import imagine1 from 'assets/img/sidebar-1.jpg';
import Avatar from './Avatar';
import dayjs from 'dayjs';
import Parse from 'parse';

const useStyles = makeStyles(theme => ({
  listItemText: {
    marginRight: 16,
    textAlign: ({ isIncoming }) => (isIncoming ? 'right' : 'left')
  },
  listItemTextPrimary: {
    maxWidth: 350,
    wordBreak: 'break-word',
    display: 'inline-block',
    justifyContent: 'flex-end',
    flex: 'unset',
    border: '1px solid',
    padding: 8,
    borderRadius: ({ isIncoming }) => (isIncoming ? '8px 0 8px 8px' : '0 8px 8px 8px')
  },
  listItemTextSecondary: {
    fontSize: 12,
    marginTop: 5
  },
  image: {
    height: 150,
    width: 250,
    borderRadius: ({ isIncoming }) => (isIncoming ? '8px 0 8px 8px' : '0 8px 8px 8px'),
    objectFit: 'cover',
    objectPosition: 'center'
  }
}));

const Message = ({ message }) => {
  const [online, setOnline] = useState(true);
  const [currentUser] = useState(Parse.User.current());

  const isIncoming = currentUser.id !== message.get('messageFrom').id;

  const classes = useStyles({ isIncoming, badgeColor: online ? 'warning' : 'secondary' });
  return (
    <ListItem
      alignItems="flex-start"
      style={{ justifyContent: isIncoming ? 'flex-end' : 'flex-start' }}
    >
      <ListItemAvatar style={{ order: isIncoming ? 1 : 0 }}>
        <Avatar
          src="https://material-ui.com/static/images/avatar/3.jpg"
          online={message.get('messageFrom').get('online')}
        />
      </ListItemAvatar>
      <ListItemText
        // style={{ marginRight: 16, textAlign: 'right' }}
        // className={classes.listItemText}
        classes={{
          root: classes.listItemText,
          primary: classes.listItemTextPrimary,
          secondary: classes.listItemTextSecondary
        }}
        primary={message.get('message')}
        secondary={`${message.get('messageFrom').get('username')}, ${dayjs(
          message.get('createdAt')
        ).format('hh:mm A, MMM DD')}`}
      />
      {/* <img src={imagine1} alt="" className={classes.image} /> */}
    </ListItem>
  );
};

export default Message;
