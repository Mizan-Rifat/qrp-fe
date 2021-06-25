import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from 'redux/ducks/userDuck';
import Table from 'components/Table/Table.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import { Button as MButton, makeStyles } from '@material-ui/core';
import { ucFirst, sentenceCase } from '../../utils';
import dayjs from 'dayjs';
import MaterialTable, { MTableToolbar } from 'material-table';
import Button from 'components/CustomButtons/Button.js';
import CardFooter from 'components/Card/CardFooter';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import MLightBox from 'components/Lightbox/MLightBox';

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
        width: '20%'
      }
    },
    {
      field: 'value',
      render: rowData => {
        if (rowData.image) {
          return (
            <img
              src={rowData.value}
              alt=""
              height="150"
              onClick={() => handleImageClick(rowData.value)}
            />
          );
        }
        if (typeof rowData.value === 'boolean') {
          return ucFirst(rowData.value.toString());
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
      const fieldsssss = [
        'softwareSystem',
        'typeOfShifts',
        'location',
        'firstName',
        'lastName',
        'username',
        'addressOne',
        'addressTwo',
        'city',
        'province',
        'postalCode',
        'country',
        'phone',
        'govPhotoId',
        'currentJobTitle',
        'skills',
        'pharmacyExperience',
        'licenseNumber',
        'provinceOfLicense',
        'pharmacyName',
        'status',
        'createdAt',
        'smsExpireDateTime',
        'smsNumber',
        'smsVerified',
        'pharmacyType',
        'managerAsOwner',
        'profilePicture',
        'pharmacyBanner',
        'language'
      ];

      const fields = [
        {
          field: 'softwareSystem',
          type: 'string'
        },
        {
          field: 'typeOfShifts',
          type: 'string'
        },
        {
          field: 'location',
          type: 'string'
        },
        {
          field: 'firstName',
          type: 'string'
        },
        {
          field: 'lastName',
          type: 'string'
        },
        {
          field: 'username',
          type: 'string'
        },
        {
          field: 'addressOne',
          type: 'string'
        },
        {
          field: 'addressTwo',
          type: 'string'
        },
        {
          field: 'city',
          type: 'string'
        },
        {
          field: 'province',
          type: 'string'
        },
        {
          field: 'postalCode',
          type: 'string'
        },
        {
          field: 'country',
          type: 'string'
        },
        {
          field: 'phone',
          type: 'string'
        },
        {
          field: 'govPhotoId',
          type: 'string'
        },
        {
          field: 'currentJobTitle',
          type: 'string'
        },
        {
          field: 'skills',
          type: 'string'
        },
        {
          field: 'pharmacyExperience',
          type: 'string'
        },
        {
          field: 'licenseNumber',
          type: 'string'
        },
        {
          field: 'provinceOfLicense',
          type: 'string'
        },
        {
          field: 'pharmacyName',
          type: 'string'
        },
        {
          field: 'status',
          type: 'string'
        },
        {
          field: 'createdAt',
          type: 'string',
          label: 'Joined'
        },
        {
          field: 'smsExpireDateTime',
          type: 'string'
        },
        {
          field: 'smsNumber',
          type: 'string'
        },
        {
          field: 'smsVerified',
          type: 'string'
        },
        {
          field: 'pharmacyType',
          type: 'string'
        },
        {
          field: 'managerAsOwner',
          type: 'string'
        },
        {
          field: 'profilePicture',
          type: 'string'
        },
        {
          field: 'pharmacyBanner',
          type: 'string'
        },
        {
          field: 'language',
          type: 'string'
        }
      ];

      console.log(
        fields.map(field => ({
          field: field,
          type: 'string'
        }))
      );

      const td = Object.keys(user.attributes).map(item => {
        const rowObj = value => ({
          label: sentenceCase(item),
          value: value ? value : 'None',
          image: ['profilePicture', 'pharmacyBanner', 'govPhotoId'].includes(item)
        });

        if (typeof user.get(item) !== 'object') {
          return rowObj(user.get(item));
        } else if (Array.isArray(user.get(item))) {
          return rowObj(user.get(item).join(', '));
        } else if (dayjs(user.get(item)).isValid()) {
          return rowObj(dayjs(user.get(item)).format('MMMM DD, YYYY - hh:MM A'));
        } else {
          console.log(item, user.get(item));
          return rowObj(typeof user.get(item));
        }
      });
      setTableData(td);

      console.log({ td });
    }
  }, [user]);

  return (
    <>
      <div className="" style={{ textAlign: 'right', marginBottom: 48 }}>
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
      </div>
      <Card plain>
        <CardHeader plain color="primary">
          <h4 className={classes.cardTitleWhite}>User Details</h4>
          <p className={classes.cardCategoryWhite}>
            {Object.keys(user).length > 0 && user.get('username')}
          </p>
        </CardHeader>
        <CardBody>
          <MaterialTable
            style={{ boxShadow: 'unset', background: 'unset' }}
            title=""
            columns={columns}
            data={tableData}
            isLoading={fetching}
            options={{
              paging: false,
              header: false,
              search: false,
              toolbar: false
            }}
            // components={{
            //   Toolbar: props => (
            //     <div>
            //       <MTableToolbar {...props} />
            //       <div style={{ textAlign: 'right' }}>
            //         <Button color="primary">Update Profile</Button>
            //       </div>
            //     </div>
            //   )
            // }}
          />

          {lightBox.open && <MLightBox lightBox={lightBox} setLightBox={setLightBox} />}
        </CardBody>
        <CardFooter style={{ justifyContent: 'flex-end' }}>
          <Button color="danger">Decline</Button>
          <Button color="success">Approve</Button>
        </CardFooter>
      </Card>
    </>
  );
};

UserDetails.propTypes = {
  user: PropTypes.Object
};

export default UserDetails;
