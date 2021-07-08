import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Parse from 'parse';

export const AdminProtectedRoute = ({ children }) => {
  const currentUser = Parse.User.current();

  return <>{currentUser ? <> {children} </> : <Redirect to="/login" />}</>;
};
