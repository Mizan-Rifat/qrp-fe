import React, { useState, useEffect } from 'react';
import MTable from 'components/Table/MTable';
import { Box } from '@material-ui/core';

const ManagerDetails = ({ fetching, manager }) => {
  const [data, setData] = useState([]);
  const columns = [
    {
      field: 'label',
      cellStyle: {
        fontWeight: 400,
        width: '200px'
      }
    },
    {
      field: 'value'
    }
  ];

  useEffect(() => {
    const data = [
      {
        label: 'Name',
        value: `${manager.get('firstName')} ${manager.get('lastName')}`
      },
      {
        label: 'Phone',
        value: manager.get('phone')
      },
      {
        label: 'License Number',
        value: manager.get('licenseNumber')
      }
    ];
    setData(data);
  }, [manager]);
  return (
    <Box mt={3}>
      <h5 style={{ fontWeight: 400, marginLeft: 12, marginBottom: 4 }}>Manager Details</h5>
      <MTable
        columns={columns}
        title="Manager"
        data={data}
        fetching={fetching}
        options={{
          paging: false,
          header: false,
          search: false,
          toolbar: false
        }}
      />
    </Box>
  );
};

export default ManagerDetails;
