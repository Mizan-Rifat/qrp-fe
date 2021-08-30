import React, { useEffect } from 'react';
import Users from 'views/Users/Users';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'redux/ducks/usersDuck';
import useNotify from 'hooks/useNotify';

const PharmacyOwners = () => {
  const type = ['pharmacyOwner'];
  const toast = useNotify();

  const { pharmacyOwners, fetching } = useSelector(state => state.users);
  const dispatch = useDispatch();

  console.log({ pharmacyOwners });

  useEffect(async () => {
    if (pharmacyOwners.length <= 0) {
      dispatch(fetchUsers(type, 'pharmacyOwners')).catch(err => {
        toast(err.message, 'error');
      });
    }
  }, []);

  return <Users type={type} title="Pharmacy Owners" users={pharmacyOwners} fetching={fetching} />;
};

export default PharmacyOwners;
