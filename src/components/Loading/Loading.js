import { Box, CircularProgress } from '@material-ui/core';
import React from 'react';

export const Loading = () => {
  return (
    <Box position="absolute" top="50%" left="50%">
      <CircularProgress />
    </Box>
  );
};
