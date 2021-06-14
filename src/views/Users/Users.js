import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import EnhancedTable from 'components/Table/AdvanceTable';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import MaterialTable from 'material-table';
import axios from 'axios';

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
const Users = props => {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [flag, setflag] = useState(false);

  const columns = [
    {
      title: 'Id',
      field: 'id',
      width: '1%',
      cellStyle: {
        width: '1%'
      },
      sorting: false,
      searchable: false
    },
    {
      title: 'Name',
      field: 'name'
    },
    {
      title: 'Email',
      field: 'email'
    },
    {
      title: 'Website',
      field: 'website'
    },
    {
      title: 'Company',
      field: 'company.name'
    }
  ];

  useEffect(async () => {
    const res = await axios.get('https://jsonplaceholder.typicode.com/users');
    console.log(users);
    setUsers(res.data);
    setLoading(false);
  }, []);

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
          isLoading={loading}
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit',
              onClick: (event, rowData) => {
                console.log(rowData);
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
