import React, { useEffect } from 'react';
import Users from 'views/Users/Users';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'redux/ducks/usersDuck';
import useNotify from 'hooks/useNotify';
import { fetchEmergencyshifts } from 'redux/ducks/emergencyShiftsDuck';
import Parse from 'parse';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import distance from 'google-distance-matrix';
distance.key('AIzaSyA1f7fx1qEvKj77QHf7hnDaanMoYyXrXwc');
distance.mode('driving');

const Staffs = () => {
  const type = ['Pharmacist', 'Other'];
  const toast = useNotify();

  const { staffs, fetching, loading } = useSelector(state => state.users);
  const dispatch = useDispatch();

  useEffect(async () => {
    const messages = await Parse.Cloud.run('transferAmount');
    console.log({ messages });
  }, []);
  return (
    <Users type={type} title="Manage Staffs" users={staffs} fetching={fetching} loading={loading} />
  );
};

export default Staffs;
