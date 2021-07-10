import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar as MAvatar } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  }
}));

export default function Card({ src, size }) {
  const classes = useStyles();

  return <MAvatar className={classes[size]} src={src} />;
}

Card.propTypes = {
  size: PropTypes.string
};
