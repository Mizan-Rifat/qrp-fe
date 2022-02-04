import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import Button from 'components/CustomButtons/Button.js';
import { setUserLoadingTrue, setUserLoadingFalse } from 'redux/ducks/userDuck';
import { userUpdated } from 'redux/ducks/userDuck';
import Parse from 'parse';
import { useConfirmation } from 'hooks/useConfirmation/ConfirmationService';
import useNotify from 'hooks/useNotify';
import { cancelShift, deleteShift } from 'redux/ducks/shiftDuck';

const ShiftActionButtons = ({ shiftId, shiftCandidatesId }) => {
  const { id } = useParams();
  const confirm = useConfirmation();
  const toast = useNotify();

  const { user, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleCancelShift = () => {
    confirm({
      variant: 'danger',
      catchOnCancel: true,
      title: 'Are you sure to cancel this shift?'
    })
      .then(async () => {
        await dispatch(cancelShift());
        toast('Successfully shift cancelled.', 'success');
      })
      .catch(err => {
        console.log({ err });
        if (err) {
          toast(err.message, 'error');
        }
      });
  };
  const handleDeleteShift = () => {
    confirm({
      variant: 'danger',
      catchOnCancel: true,
      title: 'Are you sure to delete this shift?'
    })
      .then(() => {
        dispatch(deleteShift());
      })
      .catch(() => {
        console.log('No');
      });
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" my={5}>
        <Button color="secondary" onClick={handleCancelShift} style={{ marginRight: 10 }}>
          Cancel Shift
        </Button>
        <Button color="danger" onClick={handleDeleteShift} style={{ marginRight: 10 }}>
          Delete Shift
        </Button>
      </Box>
    </>
  );
};

export default ShiftActionButtons;
