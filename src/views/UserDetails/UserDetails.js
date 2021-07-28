import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, resetUserState } from 'redux/ducks/userDuck';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import { Box, Button as MButton, CircularProgress, Grid, makeStyles } from '@material-ui/core';
import { ucFirst, sentenceCase } from '../../utils';
import dayjs from 'dayjs';
import MaterialTable, { MTableToolbar } from 'material-table';
import Button from 'components/CustomButtons/Button.js';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MLightBox from 'components/Lightbox/MLightBox';
import image from '../../assets/img/no-image.png';
import ManagerDetails from './ManagerDetails';
import FormDialog from 'components/Dialog/FormDialog';
import { Loading } from 'components/Loading/Loading';
import { setUserLoadingTrue } from 'redux/ducks/userDuck';
import { userUpdated } from 'redux/ducks/userDuck';
import Parse from 'parse';
import { setUserLoadingFalse } from 'redux/ducks/userDuck';
import AlertDialog from 'components/Alert/Alert';

import Snackbar from 'components/Snackbar/Snackbar.js';
import QuestionnaireDialog from 'components/Dialog/QuestionnaireDialog';
import { resetQuestionnaireState } from 'redux/ducks/questionnaireDuck';

const styles = {
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0'
    },
    '& a,& a:hover,& a:focus': {
      color: '#FFFFFF'
    }
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1'
    }
  }
};

const useStyles = makeStyles(styles);

const UserDetails = () => {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

  const [tableData, setTableData] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [statusAlertOpen, setStatusAlertOpen] = useState(false);
  const [openQuestionnaireDialog, setOpenQuestionnaireDialog] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [lightBox, setLightBox] = useState({
    open: false,
    images: [],
    selectedindex: ''
  });

  const { fetching, user, parseUser, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleImageClick = image => {
    setLightBox({
      open: true,
      images: [image],
      selectedindex: 0
    });
  };

  const handleApprove = () => {
    dispatch(setUserLoadingTrue());
    Parse.Cloud.run('user-status', {
      uid: id,
      status: !user.status
    }).then(res => {
      setUserLoadingFalse(false);
      setNotiOpen(true);
      dispatch(
        userUpdated({
          key: 'status',
          value: res.get('status')
        })
      );
    });
  };

  const columns = [
    {
      field: 'label',
      cellStyle: {
        fontWeight: 400,
        width: '200px'
      }
    },
    {
      field: 'value',
      render: rowData => {
        if (Array.isArray(rowData.value)) {
          return rowData.value.join(', ');
        }
        if (typeof rowData.value === 'boolean') {
          return ucFirst(rowData.value.toString());
        }
        if (!rowData.value) {
          return 'None';
        }
        return rowData.value;
      }
    }
  ];

  const Picture = ({ label, src, handleImageClick }) => (
    <>
      <p style={{ fontWeight: 500 }}>{label} :</p>
      <img src={src} alt="" height="150" onClick={() => handleImageClick(src)} />
    </>
  );
  useEffect(() => {
    dispatch(fetchUser(id));

    return () => {
      dispatch(resetUserState());
      dispatch(resetQuestionnaireState());
    };
  }, [id]);

  useEffect(() => {
    if (Object.keys(user).length) {
      const fields = [
        'username',
        'phone',
        'softwareSystem',
        'typeOfShifts',
        'currentJobTitle',
        'skills',
        'pharmacyExperience',
        'licenseNumber',
        'provinceOfLicense',
        'pharmacyName',
        'smsNumber',
        'smsVerified',
        'pharmacyType',
        'managerAsOwner'
      ];

      const data = [
        {
          label: 'Name',
          value: `${user.firstName} ${user.lastName}`
        },
        {
          label: 'Type',
          value: user.roles.map(role => role.get('name'))
        },
        {
          label: 'Commission',
          value: user.commission ? `${user.commission}%` : 'null'
        },
        ...fields.map(field => ({
          label: sentenceCase(field),
          value: user[field]
        })),
        {
          label: 'Address',
          value: `${user.addressOne}${user.addressTwo && ', ' + user.addressTwo}, ${user.city}, ${
            user.province
          }, ${user.postalCode}, ${user.country}`
        },
        {
          label: 'Joined',
          value: dayjs(user.createdAt).format('MMMM DD, YYYY - hh:MM A'),
          type: 'date'
        },
        {
          label: 'Language',
          value: user.language ? 'French' : 'English'
        },
        {
          label: 'Approved',
          value: user.status ? 'Yes' : 'No'
        }
      ];

      setTableData(data);
    }
  }, [user]);

  return (
    <Box position="relative">
      {fetching ? (
        <Loading position={{ top: '40%', left: '50%' }} />
      ) : (
        <>
          <Box mb={6}>
            <MButton
              variant="contained"
              color="secondary"
              className={classes.button}
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={() => history.goBack()}
            >
              Back to list
            </MButton>
          </Box>
          <Card plain>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>User Details</h4>
              <p className={classes.cardCategoryWhite}>
                {Object.keys(user).length > 0 && user.username}
              </p>
            </CardHeader>
            <CardBody>
              <Box display="flex" justifyContent="flex-end" my={5}>
                {tableData.find(item => item.label === 'Type') &&
                  tableData.find(item => item.label === 'Type').value.includes('pharmacyOwner') && (
                    <Button
                      color="success"
                      onClick={() => setOpenDialog(!openDialog)}
                      style={{ marginRight: 10 }}
                    >
                      Set Commission
                    </Button>
                  )}

                {user.roles.some(
                  role => role.get('name') === 'Other' || role.get('name') === 'Pharmacist'
                ) && (
                  <Button
                    color="primary"
                    onClick={() => setOpenQuestionnaireDialog(!openQuestionnaireDialog)}
                    style={{ marginRight: 10 }}
                  >
                    View Questionnaire
                  </Button>
                )}

                <Box position="relative">
                  <Button
                    color={user.status ? 'danger' : 'success'}
                    onClick={() => setStatusAlertOpen(true)}
                    disabled={loading}
                  >
                    {user.status ? 'Decline' : 'Approve'}
                  </Button>

                  {loading && (
                    <Box position="absolute" top="33%" left="39%">
                      <CircularProgress size={16} />
                    </Box>
                  )}
                </Box>
              </Box>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <MaterialTable
                    style={{ boxShadow: 'unset', background: 'unset' }}
                    title=""
                    columns={columns}
                    data={tableData.slice(0, 11)}
                    isLoading={fetching}
                    options={{
                      paging: false,
                      header: false,
                      search: false,
                      toolbar: false
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MaterialTable
                    style={{ boxShadow: 'unset', background: 'unset' }}
                    title=""
                    columns={columns}
                    data={tableData.slice(11, tableData.length)}
                    isLoading={fetching}
                    options={{
                      paging: false,
                      header: false,
                      search: false,
                      toolbar: false
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} style={{ paddingLeft: 12 }}>
                <Grid item xs={12} sm={4}>
                  <Picture
                    label="Profile Picture"
                    src={user.profilePicture ? user.profilePicture : image}
                    handleImageClick={handleImageClick}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Picture
                    label="Govt Photo Id"
                    src={user.govPhotoId ? user.govPhotoId : image}
                    handleImageClick={handleImageClick}
                  />
                </Grid>

                {tableData.find(item => item.label === 'Type') &&
                  tableData.find(item => item.label === 'Type').value.includes('pharmacyOwner') && (
                    <Grid item xs={12} sm={4}>
                      <Picture
                        label="Pharmacy Banner"
                        src={user.pharmacyBanner ? user.pharmacyBanner : image}
                        handleImageClick={handleImageClick}
                      />
                    </Grid>
                  )}
              </Grid>

              {user.hasOwnProperty('manager') && (
                <ManagerDetails fetching={fetching} manager={user.manager} />
              )}

              <FormDialog
                open={openDialog}
                setOpen={setOpenDialog}
                uid={id}
                value={user.commission}
              />

              {openQuestionnaireDialog && (
                <QuestionnaireDialog
                  open={openQuestionnaireDialog}
                  setOpen={setOpenQuestionnaireDialog}
                  user={user}
                  parseUser={parseUser}
                  value={user.commission}
                />
              )}
              {lightBox.open && <MLightBox lightBox={lightBox} setLightBox={setLightBox} />}
              <AlertDialog
                open={statusAlertOpen}
                setOpen={setStatusAlertOpen}
                handleAgree={handleApprove}
                message={
                  user.status
                    ? 'Are you sure to decline this user?'
                    : 'Are you sure to approve this user?'
                }
              />
              <Snackbar
                place="tr"
                color="success"
                message="Successfully updated."
                open={notiOpen}
                closeNotification={() => setNotiOpen(false)}
                close
              />
            </CardBody>
          </Card>
        </>
      )}
    </Box>
  );
};

UserDetails.propTypes = {
  user: PropTypes.Object
};

export default UserDetails;
