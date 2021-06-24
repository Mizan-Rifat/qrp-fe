import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

const UserDetails = ({ user }) => {
  const { id } = useParams();
  return <div>{id}</div>;
};

UserDetails.propTypes = {
  user: PropTypes.Object
};

export default UserDetails;
