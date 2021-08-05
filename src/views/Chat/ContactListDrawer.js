import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
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

export default function ContactListDrawer() {
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
