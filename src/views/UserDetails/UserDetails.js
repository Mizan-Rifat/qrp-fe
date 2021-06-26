import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from 'redux/ducks/userDuck';
import Table from 'components/Table/Table.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import { Box, Button as MButton, Grid, makeStyles } from '@material-ui/core';
import { ucFirst, sentenceCase } from '../../utils';
import dayjs from 'dayjs';
import MaterialTable, { MTableToolbar } from 'material-table';
import Button from 'components/CustomButtons/Button.js';
import CardFooter from 'components/Card/CardFooter';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import MLightBox from 'components/Lightbox/MLightBox';
import image from '../../assets/img/no-image.png';

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

  const [tableData, setTableData] = useState([]);

  const [lightBox, setLightBox] = useState({
    open: false,
    images: [],
    selectedindex: ''
  });

  const { fetching, user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleImageClick = image => {
    setLightBox({
      open: true,
      images: [image],
      selectedindex: 0
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
        if (rowData.type === 'image') {
          return (
            <img
              src={rowData.value ? rowData.value : image}
              alt=""
              height="150"
              onClick={() => handleImageClick(rowData.value)}
            />
          );
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
  useEffect(() => {
    dispatch(fetchUser(id));
  }, [id]);

  useEffect(() => {
    if (Object.keys(user).length) {
      const fields = [
        'firstName',
        'lastName',
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
        'smsExpireDateTime',
        'smsNumber',
        'smsVerified',
        'pharmacyType',
        'managerAsOwner',
        'profilePicture',
        'govPhotoId',
        'pharmacyBanner'
      ];

      const data = [
        ...fields.map(field => ({
          label: sentenceCase(field),
          value: ['smsExpireDateTime'].includes(field)
            ? dayjs(user.get(field)).format('MMMM DD, YYYY - hh:MM A')
            : user.get(field),
          type: ['profilePicture', 'pharmacyBanner', 'govPhotoId'].includes(field) && 'image'
        })),
        {
          label: 'Address',
          value: `${user.get('addressOne')},${user.get('city')},${user.get('country')}`
        },
        {
          label: 'Joined',
          value: dayjs(user.get('createdAt')).format('MMMM DD, YYYY - hh:MM A'),
          type: 'date'
        },
        {
          label: 'Language',
          value: user.get('language') ? 'French' : 'English'
        },
        {
          label: 'Approved',
          value: user.get('status') ? 'Yes' : 'No'
        }
      ].sort((a, b) => (a.type === 'image' ? 1 : 0));

      console.log({ data });

      setTableData(data);
    }
  }, [user]);

  return (
    !fetching && (
      <>
        <Box textAlign="right" mb={6}>
          <Link to="/admin/users">
            <MButton
              variant="contained"
              color="secondary"
              className={classes.button}
              size="small"
              startIcon={<ArrowBackIcon />}
              // component={Link}
            >
              User list
            </MButton>
          </Link>
        </Box>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>User Details</h4>
            <p className={classes.cardCategoryWhite}>
              {Object.keys(user).length > 0 && user.get('username')}
            </p>
          </CardHeader>
          <CardBody>
            <Box display="flex" justifyContent="flex-end" my={5}>
              <Button color={user.get('status') ? 'danger' : 'success'}>
                {user.get('status') ? 'Decline' : 'Approve'}
              </Button>
            </Box>
            <Grid container>
              <Grid item lg={6}>
                <MaterialTable
                  style={{ boxShadow: 'unset', background: 'unset' }}
                  title=""
                  columns={columns}
                  data={tableData.slice(0, 16)}
                  isLoading={fetching}
                  options={{
                    paging: false,
                    header: false,
                    search: false,
                    toolbar: false
                  }}
                />
              </Grid>
              <Grid item lg={6}>
                <MaterialTable
                  style={{ boxShadow: 'unset', background: 'unset' }}
                  title=""
                  columns={columns}
                  data={tableData.slice(16, tableData.length)}
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

            {lightBox.open && <MLightBox lightBox={lightBox} setLightBox={setLightBox} />}
          </CardBody>
        </Card>
      </>
    )
  );
};

UserDetails.propTypes = {
  user: PropTypes.Object
};

export default UserDetails;
