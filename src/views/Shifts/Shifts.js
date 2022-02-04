import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import { Box, Button, TextField } from '@material-ui/core';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import TableLayout from 'layouts/TableLayout';
import { fetchShifts } from 'redux/ducks/shiftsDuck';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import SearchIcon from '@material-ui/icons/Search';

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
const Shifts = () => {
  const classes = useStyles();
  const history = useHistory();
  const { shifts, fetching, loading } = useSelector(state => state.shifts);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const columns = [
    {
      title: 'Shift Date & Time',
      field: 'shiftDate',
      render: rowData => (
        <>
          <p style={{ margin: 0 }}>{dayjs(rowData.shiftDate).format('DD MMM, YYYY')}</p>
          <p style={{ margin: 0 }}>
            {dayjs(rowData.formattedStartTime).format('hh:mm a')} -{' '}
            {dayjs(rowData.formattedEndTime).format('hh:mm a')}
          </p>
        </>
      )
    },

    {
      title: 'Pharmacy Name',
      field: 'pharmacyId.pharmacyName'
    },
    {
      title: 'Requested For',
      field: 'requestFor'
    },
    {
      title: 'Hour Rate',
      field: 'payRate',
      render: rowData =>
        rowData.payRate.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
    },
    {
      title: 'Shift Status',
      field: 'status',
      render: rowData => (rowData.status ? rowData.shifter?.shiftStatus : 'Pending')
    }
  ];

  const handleFilter = () => {
    console.log({ startDate, endDate });
    dispatch(fetchShifts(dayjs(startDate), dayjs(endDate).hour(23).minute(59)));
  };

  useEffect(() => {
    if (shifts.length <= 0) {
      dispatch(fetchShifts());
    }
  }, []);

  return (
    <TableLayout title="Shifts">
      <Box display="flex" alignItems="center" justifyContent="center">
        <TextField
          id="date"
          label="From"
          type="date"
          defaultValue="2017-05-24"
          style={{ marginRight: 16 }}
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="date"
          label="To"
          type="date"
          defaultValue="2017-05-24"
          style={{ marginRight: 16 }}
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true
          }}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleFilter}
          disabled={!startDate || !endDate}
        >
          <SearchIcon />
        </Button>
      </Box>
      <MaterialTable
        style={{ boxShadow: 'unset', background: 'unset' }}
        title=""
        columns={columns}
        data={shifts}
        isLoading={fetching || loading}
        actions={[
          {
            icon: 'list_alt',
            tooltip: 'Details',
            onClick: (event, rowData) => {
              history.push(`/shifts/${rowData.id}`);
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
    </TableLayout>
  );
};

export default Shifts;
