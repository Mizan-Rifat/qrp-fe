import React, { useEffect } from 'react';
import Users from 'views/Users/Users';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'redux/ducks/usersDuck';

const Staffs = () => {
  const type = ['Pharmacist', 'Other'];

  const { staffs, fetching } = useSelector(state => state.users);
  const dispatch = useDispatch();

  useEffect(async () => {
    if (staffs.length <= 0) {
      dispatch(fetchUsers(type, 'staffs'));
    }
  }, []);
  return <Users type={type} title="Manage Staffs" users={staffs} fetching={fetching} />;
};

export default Staffs;
