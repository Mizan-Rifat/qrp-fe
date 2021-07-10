import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Parse from 'parse';

export const GuestProtectedRoute = ({ component: Component, ...rest }) => {
  const currentUser = Parse.User.current();
  return (
    <Route
      {...rest}
      render={props => (currentUser ? <Redirect to="/" /> : <Component {...props} />)}
    />
  );
};
