import MaterialTable from 'material-table';
import React from 'react';

const MTable = ({ columns, data, fetching = false, options, title = '' }) => {
  return (
    <MaterialTable
      style={{ boxShadow: 'unset', background: 'unset' }}
      title={title}
      columns={columns}
      data={data}
      isLoading={fetching}
      options={options}
    />
  );
};

export default MTable;
