import React from 'react';
import {
  ListItem,
  Grid,
  ListItemText,
  ListItemAvatar,
  Avatar,
  makeStyles
} from '@material-ui/core';
import imagine1 from 'assets/img/sidebar-1.jpg';

const useStyles = makeStyles(() => ({
  listItemText: {
    maxWidth: 350
  },
  listItemTextPrimary: {
    justifyContent: 'flex-end',
    flex: 'unset',
    border: '1px solid',
    padding: 8,
    borderRadius: ({ send }) => (send ? '8px 0 8px 8px' : '0 8px 8px 8px')
  },
  image: {
    height: 150,
    width: 250,
    borderRadius: ({ send }) => (send ? '8px 0 8px 8px' : '0 8px 8px 8px'),
    objectFit: 'cover',
    objectPosition: 'center'
  }
}));

const Message = ({ send }) => {
  const classes = useStyles({ send });
  return (
    <ListItem alignItems="flex-start" style={{ justifyContent: send ? 'flex-end' : 'flex-start' }}>
      <ListItemAvatar style={{ order: send ? 1 : 0 }}>
        <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/3.jpg" />
      </ListItemAvatar>
      {/* <ListItemText
        style={{ marginRight: 16 }}
        // className={classes.listItemText}
        classes={{
          root: classes.listItemText,
          primary: classes.listItemTextPrimary
        }}
        primary="lorem30Commodo dolore culpa sit exercitation proident.Proident velit du aliquip pariatur."
        // primary="Brunch this weekend?"
        secondary="17 Jun, 10:24PM"
      /> */}
      <img src={imagine1} alt="" className={classes.image} />
    </ListItem>
  );
};

export default Message;
