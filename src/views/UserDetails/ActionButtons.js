import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, resetUserState } from 'redux/ducks/userDuck';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import { Box, Button as MButton, CircularProgress, Grid, makeStyles } from '@material-ui/core';
import { ucFirst, sentenceCase } from '../../utils';
import dayjs from 'dayjs';
import MaterialTable from 'material-table';
import Button from 'components/CustomButtons/Button.js';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MLightBox from 'components/Lightbox/MLightBox';
import image from '../../assets/img/no-image.png';
import ManagerDetails from './ManagerDetails';
import FormDialog from 'components/Dialog/FormDialog';
import { Loading } from 'components/Loading/Loading';
import { setUserLoadingTrue, setUserLoadingFalse } from 'redux/ducks/userDuck';
import { userUpdated } from 'redux/ducks/userDuck';
import Parse from 'parse';
import { useConfirmation } from 'hooks/useConfirmation/ConfirmationService';
import QuestionnaireDialog from 'components/Dialog/QuestionnaireDialog';
import { resetQuestionnaireState } from 'redux/ducks/questionnaireDuck';
import useNotify from 'hooks/useNotify';
import AddressDialog from './AddressDialog';

const ActionButtons = () => {
  const { id } = useParams();
  const confirm = useConfirmation();
  const toast = useNotify();
  const [openDialog, setOpenDialog] = useState(false);
  const [openQuestionnaireDialog, setOpenQuestionnaireDialog] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);

  const { fetching, user, parseUser, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleApprove = async status => {
    dispatch(setUserLoadingTrue());
    const res = await Parse.Cloud.run('user-status', {
      uid: id,
      status
    }).catch(err => {
      dispatch(setUserLoadingFalse());
      toast(err.message, 'error');
      return;
    });
    if (res) {
      toast('Successfully updated.', 'success');
      dispatch(
        userUpdated({
          key: 'status',
          value: res.get('status')
        })
      );

      if (user.waiting) {
        dispatch(
          userUpdated({
            key: 'waiting',
            value: false
          })
        );
      }

      //send email to user
      Parse.Cloud.run('statusUpdateByQRP', {
        email: user.username,
        name: user.firstName,
        status: status ? 'Approved' : 'Declined'
      });
    }
  };

  const handleStatus = status => {
    confirm({
      variant: 'danger',
      catchOnCancel: true,
      title: status ? 'Are you sure to approve this user?' : 'Are you sure to decline this user?'
    }).then(() => {
      handleApprove(status);
    });
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" my={5}>
        <Button
          color="secondary"
          onClick={() => setOpenAddressDialog(!openAddressDialog)}
          style={{ marginRight: 10 }}
        >
          Update Address
        </Button>
        {user.userType === 'pharmacyOwner' ? (
          <Button
            color="success"
            onClick={() => setOpenDialog(!openDialog)}
            style={{ marginRight: 10 }}
          >
            Set Commission
          </Button>
        ) : (
          <Button
            color="primary"
            onClick={() => setOpenQuestionnaireDialog(!openQuestionnaireDialog)}
            style={{ marginRight: 10 }}
          >
            View Questionnaire
          </Button>
        )}

        <Box position="relative">
          {(user.waiting || !user.status) && (
            <Button
              color="success"
              onClick={() => handleStatus(true)}
              disabled={loading}
              style={{ marginRight: 4 }}
            >
              Approve
            </Button>
          )}
          {(user.waiting || user.status) && (
            <Button color="danger" onClick={() => handleStatus(false)} disabled={loading}>
              Decline
            </Button>
          )}
        </Box>
      </Box>

      <FormDialog open={openDialog} setOpen={setOpenDialog} uid={id} value={user.commission} />

      <AddressDialog
        open={openAddressDialog}
        setOpen={setOpenAddressDialog}
        user={user}
        userId={id}
      />

      <QuestionnaireDialog
        open={openQuestionnaireDialog}
        setOpen={setOpenQuestionnaireDialog}
        user={user}
        parseUser={parseUser}
        value={user.commission}
      />
    </>
  );
};

export default ActionButtons;
