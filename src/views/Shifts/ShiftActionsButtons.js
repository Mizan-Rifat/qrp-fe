import React from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { Box } from '@material-ui/core';
import Button from 'components/CustomButtons/Button.js';
import { useConfirmation } from 'hooks/useConfirmation/ConfirmationService';
import useNotify from 'hooks/useNotify';
import { cancelShift, deleteShift } from 'redux/ducks/shiftDuck';
import { useHistory } from 'react-router-dom';

const ShiftActionButtons = ({ shift }) => {
  const { id } = useParams();
  const history = useHistory();
  const confirm = useConfirmation();
  const toast = useNotify();
  const dispatch = useDispatch();
  const handleCancelShift = () => {
    confirm({
      variant: 'danger',
      catchOnCancel: true,
      title: 'Are you sure to cancel this shift?'
    })
      .then(async () => {
        await dispatch(cancelShift(id));
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
      .then(async () => {
        await dispatch(deleteShift(id));
        toast('Successfully shift deleted.', 'success');
        history.push('/shifts');
      })
      .catch(err => {
        console.log('No');
        if (err) {
          toast(err.message, 'error');
        }
      });
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" my={5}>
        <Button
          color="secondary"
          onClick={handleCancelShift}
          style={{ marginRight: 10 }}
          disabled={!shift.shifter}
        >
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
