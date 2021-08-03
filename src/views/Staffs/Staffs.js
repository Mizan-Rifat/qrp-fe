import React, { useEffect } from 'react';
import Users from 'views/Users/Users';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'redux/ducks/usersDuck';
import useNotify from 'hooks/useNotify';

const Staffs = () => {
  const type = ['Pharmacist', 'Other'];
  const toast = useNotify();

  const { staffs, fetching } = useSelector(state => state.users);
  const dispatch = useDispatch();

  useEffect(async () => {
    if (staffs.length <= 0) {
      dispatch(fetchUsers(type, 'staffs')).catch(err => {
        console.log({ err });
        toast(err.message, 'error');
      });
    }
  }, []);
  return <Users type={type} title="Manage Staffs" users={staffs} fetching={fetching} />;
};

export default Staffs;
