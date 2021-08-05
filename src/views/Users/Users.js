import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import MaterialTable from 'material-table';
import Avatar from '../../components/Avatar/Avatar';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router';
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
const Users = ({ type, title, users, fetching }) => {
  const classes = useStyles();

  const history = useHistory();

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
    },
    {
      title: 'Avg Ratings',
      field: 'avgRatings',
      align: 'center',
      render: rowData => (rowData.avgRatings ? rowData.avgRatings : 0)
    }
  ];

  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>{title}</h4>
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
              icon: 'chat',
              tooltip: 'Message',
              onClick: (event, rowData) => {
                history.push(`/messages?rid=${rowData.id}`);
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
            }
          ]}
          options={{
            actionsColumnIndex: -1,
            pageSize: 10,
            selection: false
          }}
        />
      </CardBody>
    </Card>
  );
};

Users.propTypes = {};

export default Users;
