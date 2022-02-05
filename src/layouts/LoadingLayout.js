import { Box, makeStyles } from '@material-ui/core';
import { Loading } from 'components/Loading/Loading';
import React from 'react';
import clsx from 'clsx';

const styles = {
  loading: {
    pointerEvent: 'none',
    opacity: 0.5
  }
};

const useStyles = makeStyles(styles);

export const LoadingLayout = ({ position, size = 35, loading, children }) => {
  const classes = useStyles();
  return (
    <Box position="relative" minHeight={300} className={clsx({ [classes.loading]: loading })}>
      {loading && <Loading position={position} size={size} />}
      {children}
    </Box>
  );
};
