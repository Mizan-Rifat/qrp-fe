import React, { useContext } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { Contacts, MessageContext } from './Messages';

const useStyles = makeStyles({
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  },
  paper: {
    position: 'absolute',
    width: 300
  }
});

export default function TemporaryDrawer() {
  const classes = useStyles();
  const { openDialog, setOpenDialog } = useContext(MessageContext);

  return (
    <Drawer
      anchor="left"
      classes={{
        paper: classes.paper
      }}
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      ModalProps={{
        container: document.getElementById('appContainerDiv'),
        style: { position: 'absolute' }
      }}
    >
      <Contacts />
    </Drawer>
  );
}
