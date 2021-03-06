import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import MaterialTable from 'material-table';
import Avatar from '../../components/Avatar/Avatar';
import { Grid } from '@material-ui/core';
import Parse from 'parse';
import MessageDialog from './MessageDialog';

const useStyles = makeStyles(theme => ({
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
const PushNotifications = () => {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const columns = [
    {
      title: 'Name',
      field: 'name',
      render: rowData => (
        <Grid container alignItems="center" spacing={0}>
          <Avatar size="small" src={rowData.profilePicture} />
          <p style={{ margin: '0 0 0 8px' }}>{rowData.name}</p>
        </Grid>
      )
    },
    {
      title: 'Email',
      field: 'customEmail'
    },
    {
      title: 'Province',
      field: 'province'
    },
    {
      title: 'City',
      field: 'city'
    }
  ];

  useEffect(async () => {
    const User = new Parse.User();
    const userQuery = new Parse.Query(User);
    userQuery.equalTo('userType', 'pharmacyOwner');
    userQuery.exists('deviceId');
    userQuery.descending('createdAt');
    const parseUsers = await userQuery.find().catch(err => {});

    const users = parseUsers.map(user => ({
      id: user.id,
      ...user.attributes,
      name: `${user.get('firstName')} ${user.get('lastName')}`
    }));
    setFetching(false);
    setUsers(users);
  }, []);

  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>Custom Push Notifications to Owner</h4>
      </CardHeader>
      <CardBody>
        <MaterialTable
          style={{ boxShadow: 'unset', background: 'unset' }}
          title=""
          columns={columns}
          data={users}
          isLoading={fetching}
          actions={[
            {
              tooltip: 'Sent push notification to the selected users',
              icon: 'message',
              onClick: (evt, data) => {
                setOpenDialog(true);
                setSelectedUsers(data);
              }
            }
          ]}
          options={{
            actionsColumnIndex: -1,
            pageSize: 10,
            selection: true,
            filtering: true
          }}
        />
      </CardBody>
      <MessageDialog data={selectedUsers} open={openDialog} setOpen={setOpenDialog} />
    </Card>
  );
};

PushNotifications.propTypes = {};

export default PushNotifications;
