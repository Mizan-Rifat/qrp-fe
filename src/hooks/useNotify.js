import React from 'react';
import { useSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function useNotify() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = key => (
    <>
      <IconButton
        aria-label="close"
        color="inherit"
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        <CloseIcon />
      </IconButton>
    </>
  );

  const toast = (message, variant) => {
    enqueueSnackbar(message, {
      variant,
      dense: true,
      autoHideDuration: variant == 'success' ? 2000 : 5000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      action
    });
  };

  return toast;
}
