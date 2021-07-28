import React, { useEffect } from 'react';
import Users from 'views/Users/Users';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'redux/ducks/usersDuck';
import Parse from 'parse';
import { Button } from '@material-ui/core';

const Staffs = () => {
  const type = ['Pharmacist', 'Other'];

  const { staffs, fetching } = useSelector(state => state.users);
  const dispatch = useDispatch();

  const handleUpload = e => {
    let file = e.target.files[0];
    console.log(file.name);

    const parseFile = new Parse.File(file.name, file);
    parseFile.save().then(res => {
      console.log({ res });
    });
  };

  const setSeen = async () => {
    const res = await Parse.Cloud.run('setSeen', { rid: 'WAydCJdblk' });
    console.log({ res });
  };

  useEffect(async () => {
    // const UnseenMessages = Parse.Object.extend('UnseenMessages');
    // const msgQuery = new Parse.Query(UnseenMessages);
    // msgQuery.equalTo('channelName', 'private-h2RISsGOMn-WAydCJdblk');
    // const unseenMessages = await msgQuery.first();
    // console.log({ unseenMessages });

    const res = await Parse.Cloud.run('contacts');
    console.log({ res });
    if (staffs.length <= 0) {
      dispatch(fetchUsers(type, 'staffs'));
    }
  }, []);
  return (
    <>
      <input type="file" name="image" onChange={handleUpload} />
      <Button onClick={setSeen}>Click</Button>
      <Users type={type} title="Manage Staffs" users={staffs} fetching={fetching} />;
    </>
  );
};

export default Staffs;
