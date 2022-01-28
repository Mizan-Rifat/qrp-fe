import React, { useEffect, useState } from 'react';
import Users from 'views/Users/Users';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'redux/ducks/usersDuck';
import useNotify from 'hooks/useNotify';
import { fetchEmergencyshifts } from 'redux/ducks/emergencyShiftsDuck';
import Parse from 'parse';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const Staffs = () => {
  const type = ['Pharmacist', 'Other'];
  const toast = useNotify();

  const { staffs, fetching, loading } = useSelector(state => state.users);
  const dispatch = useDispatch();

  const [users, setusers] = useState([]);

  useEffect(async () => {
    const User = new Parse.User();
    const userQuery = new Parse.Query(User);
    userQuery.equalTo('paymentDetailsProvided', true);
    const parseUsers = await userQuery.find();

    console.log({ parseUsers });

    setusers(
      parseUsers.map(user => {
        return { id: user.id, account: user.get('stripeAccountId') };
      })
    );

    parseUsers.forEach(user => {
      console.log({ [user.id]: user.get('stripeAccountId') });
    });

    const account = await Parse.Cloud.run('retriveStripeAccount', {
      accountId: 'acct_1KKIPMPxr9QczsyV'
    });

    console.log({ account });
  }, []);
  return users.map(user => (
    <p>
      {user.id}: {user.account}
    </p>
  ));
};

export default Staffs;
