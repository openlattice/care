/*
 * @flow
 */

import { AuthUtils } from 'lattice-auth';

/*
 * !!! HACK !!!
 */

const BALTIMORE_WL = [
  '@baltimorepolice.org'
];

const PORTLAND_WL = [
  '@portlandmaine.gov'
];

const isPortlandUser = () => {

  const { email } = AuthUtils.getUserInfo();
  return PORTLAND_WL.reduce((matchFound, domain) => matchFound || (!!email && email.endsWith(domain)), false);
};

export {
  BALTIMORE_WL,
  PORTLAND_WL,
  isPortlandUser
};
