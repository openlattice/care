/*
 * @flow
 */

// import { AuthUtils } from 'lattice-auth';

/*
 * !!! HACK !!!
 */

// const BALTIMORE_EMAILS_WL :string[] = [
//   '@baltimorepolice.org'
// ];

// const BALTIMORE_ORGS_WL :string[] = [];

// const PORTLAND_EMAILS_WL :string[] = [
//   '@portlandmaine.gov'
// ];

const PORTLAND_ORGS_WL :string[] = [
  '4d42d3b7-ecbe-4365-9746-eedf93239b3b'
];

const isPortlandOrg = (orgId :string) => (
  PORTLAND_ORGS_WL.reduce((matchFound, id) => matchFound || (orgId === id), false)
);

// const isPortlandUser = () => {
//
//   const { email } = AuthUtils.getUserInfo();
//   return PORTLAND_EMAILS_WL.reduce((matchFound, domain) => matchFound || (!!email && email.endsWith(domain)), false);
// };

export {
  PORTLAND_ORGS_WL,
  isPortlandOrg
};
