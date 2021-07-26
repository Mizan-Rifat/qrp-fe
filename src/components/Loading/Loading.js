import { Box, CircularProgress } from '@material-ui/core';
import React from 'react';

export const Loading = ({ position, size = 35 }) => {
  return (
    <Box position="absolute" {...position}>
      <CircularProgress size={size} />
    </Box>
  );
};
