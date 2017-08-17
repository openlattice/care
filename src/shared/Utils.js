/*
 * @flow
 */

/* eslint-disable import/prefer-default-export */

import Lattice from 'lattice';

// injected by Webpack.DefinePlugin
declare var __DEV__;

export function configureLattice(authToken :string) {

  const host :string = window.location.host;
  const hostName :string = (host.startsWith('www.')) ? host.substring('www.'.length) : host;
  const baseUrl :string = (__DEV__) ? 'http://localhost:8080' : `https://api.${hostName}`;

  Lattice.configure({ authToken, baseUrl });
}
