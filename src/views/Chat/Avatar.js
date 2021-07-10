import React from 'react';
import { Badge, Avatar as MAvatar, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  badge: {
    backgroundColor: ({ badgeColor }) => theme.palette[badgeColor].main,
    color: ({ badgeColor }) => theme.palette[badgeColor].main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      content: '""'
    }
  }
}));

const Avatar = ({ src, online }) => {
  const classes = useStyles({ badgeColor: online ? 'warning' : 'secondary' });
  return (
    <Badge
      overlap="circle"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
        color: 'danger'
      }}
      variant="dot"
      classes={{ badge: classes.badge }}
    >
      <MAvatar alt="Remy Sharp" src={src} />
    </Badge>
  );
};

export default Avatar;
