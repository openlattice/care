// @flow
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useLogout } from '../../components/hooks';
import { LOGIN_PATH } from '../../core/router/Routes';

const Logout = () => {
  useLogout()();

  return <Redirect to={LOGIN_PATH} />
}

export default Logout;
