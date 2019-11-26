// @flow
import React from 'react';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthActions } from 'lattice-auth';

const { logout } = AuthActions;
import { LOGIN_PATH } from './Routes';

const Logout = () => {
  const dispatch = useDispatch();
  dispatch(logout());

  return null;
}

export default Logout;
