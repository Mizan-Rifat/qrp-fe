import React, { useEffect } from 'react';
import Users from 'views/Users/Users';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'redux/ducks/usersDuck';
import useNotify from 'hooks/useNotify';
import { fetchEmergencyshifts } from 'redux/ducks/emergencyShiftsDuck';

const Staffs = () => {
  const type = ['Pharmacist', 'Other'];
  const toast = useNotify();

  const { staffs, fetching, loading } = useSelector(state => state.users);
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(fetchEmergencyshifts());
    if (staffs.length <= 0) {
      dispatch(fetchUsers(type, 'staffs')).catch(err => {
        toast(err.message, 'error');
      });
    }
  }, []);
  return (
    <Users type={type} title="Manage Staffs" users={staffs} fetching={fetching} loading={loading} />
  );
};

export default Staffs;
