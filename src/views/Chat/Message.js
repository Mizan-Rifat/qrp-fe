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
    maxWidth: 350
  },
  listItemTextPrimary: {
    justifyContent: 'flex-end',
    flex: 'unset',
    border: '1px solid',
    padding: 8,
    borderRadius: ({ isIncoming }) => (isIncoming ? '8px 0 8px 8px' : '0 8px 8px 8px')
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
        style={{ marginRight: 16 }}
        // className={classes.listItemText}
        classes={{
          root: classes.listItemText,
          primary: classes.listItemTextPrimary
        }}
        primary={message.get('message')}
        // primary="Brunch this weekend?"
        secondary={`${message.get('messageFrom').get('username')}, ${dayjs(
          message.get('createdAt')
        ).format('MMM DD YYYY, hh:mm A')}`}
      />
      {/* <img src={imagine1} alt="" className={classes.image} /> */}
    </ListItem>
  );
};

export default Message;
