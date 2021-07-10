import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import MaterialTable from 'material-table';
import axios from 'axios';
import Parse from 'parse';
import Avatar from '../../components/Avatar/Avatar';
import { Grid } from '@material-ui/core';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'redux/ducks/usersDuck';
import { sentenceCase } from 'utils';

const useStyles = makeStyles(theme => ({
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
}));
const Users = ({ type }) => {
  const classes = useStyles();

  const { users, fetching } = useSelector(state => state.users);
  const dispatch = useDispatch();

  const history = useHistory();

  const columns = [
    {
      title: 'Name',
      field: 'name',
      render: rowData => (
        <Grid container alignItems="center" spacing={0}>
          <Avatar size="small" src={rowData.profilePicture} />
          <p style={{ margin: '0 0 0 8px' }}>
            {rowData.firstName} {rowData.lastName}
          </p>
        </Grid>
      )
    },
    {
      title: 'Email',
      field: 'customEmail'
    },
    {
      title: 'Phone',
      field: 'phone'
    },
    {
      title: 'Type',
      field: 'type',
      render: rowData => sentenceCase(rowData.type)
    },
    {
      title: 'Address',
      field: 'city',
      render: rowData => `${rowData.city},${rowData.country}`
    }
  ];

  useEffect(async () => {
    dispatch(fetchUsers(type));
    console.log({ users });
  }, [type]);

  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>Table on Plain Background</h4>
        <p className={classes.cardCategoryWhite}>Here is a subtitle for this table</p>
      </CardHeader>
      <CardBody>
        <MaterialTable
          style={{ boxShadow: 'unset', background: 'unset' }}
          title="Simple Action Preview"
          columns={columns}
          data={users}
          isLoading={fetching}
          actions={[
            {
              icon: 'chat',
              tooltip: 'Message',
              onClick: (event, rowData) => {
                console.log(rowData);
              },
              position: 'row'
            },
            {
              icon: 'list_alt',
              tooltip: 'Details',
              onClick: (event, rowData) => {
                history.push(`/user/${rowData.id}`);
              },
              position: 'row'
            },
            {
              icon: 'delete',
              tooltip: 'Delete',
              onClick: (evt, data) => {
                console.log({ data });
              }
            }
          ]}
          options={{
            actionsColumnIndex: -1,
            pageSize: 10,
            selection: true
          }}
        />
      </CardBody>
    </Card>
  );
};

Users.propTypes = {};

export default Users;
