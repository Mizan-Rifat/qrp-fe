import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import MaterialTable from 'material-table';
import { Checkbox } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmergencyshifts } from 'redux/ducks/emergencyShiftsDuck';
import { updateEmergencyshifts } from 'redux/ducks/emergencyShiftsDuck';
import useNotify from 'hooks/useNotify';
import { Link } from 'react-router-dom';

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
const EmergencyShifts = () => {
  const classes = useStyles();
  const [tableData, setTableData] = useState([]);

  const { emergencyShifts, fetching, loading } = useSelector(state => state.emergencyShifts);
  const dispatch = useDispatch();

  const columns = [
    {
      title: 'From',
      field: 'from.name',
      render: rowData => <Link to={`/user/${rowData.from.id}`}>{rowData.from.name}</Link>,
      width: '20%',
      cellStyle: {
        width: '20%'
      }
    },
    {
      title: 'Notes',
      field: 'notes'
    },
    {
      title: 'Resolved',
      field: 'resolved',
      render: rowData => <SetResolved data={rowData} />
    }
  ];

  useEffect(() => {
    dispatch(fetchEmergencyshifts());
  }, []);

  useEffect(() => {
    if (emergencyShifts.length > 0) {
      const data = emergencyShifts.map(shift => ({
        id: shift.id,
        from: {
          name: `${shift.get('from').get('firstName')} ${shift.get('from').get('lastName')}`,
          id: shift.get('from').id
        },
        notes: shift.get('notes'),
        resolved: shift.get('resolved')
      }));

      setTableData(data);
    }
  }, [emergencyShifts]);

  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>Emergency Shifts</h4>
      </CardHeader>
      <CardBody>
        <MaterialTable
          style={{ boxShadow: 'unset', background: 'unset' }}
          title=""
          columns={columns}
          data={tableData}
          isLoading={fetching || loading}
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

const SetResolved = ({ data }) => {
  const [resolved, setResolved] = useState(data.resolved);
  const dispatch = useDispatch();
  const toast = useNotify();

  const handleChange = (checked, id) => {
    setResolved(checked);
    dispatch(updateEmergencyshifts(id, checked))
      .then(res => {
        toast('Succefully updated.', 'success');
      })
      .catch(err => {
        toast(err.message, 'error');
      });
  };
  return (
    <Checkbox
      checked={resolved}
      onChange={e => handleChange(e.target.checked, data.id)}
      color="primary"
    />
  );
};

export default EmergencyShifts;
