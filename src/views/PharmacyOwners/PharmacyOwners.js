import React, { useEffect } from 'react';
import Users from 'views/Users/Users';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'redux/ducks/usersDuck';

const PharmacyOwners = () => {
  const type = ['pharmacyOwner'];

  const { pharmacyOwners, fetching } = useSelector(state => state.users);
  const dispatch = useDispatch();

  useEffect(async () => {
    if (pharmacyOwners.length <= 0) {
      dispatch(fetchUsers(type, 'pharmacyOwners'));
    }
  }, []);

  return <Users type={type} title="Pharmacy Owners" users={pharmacyOwners} fetching={fetching} />;
};

export default PharmacyOwners;
