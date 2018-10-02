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

const BALTIMORE_ORGS_WL :string[] = [
  'eeba3be8-ffd5-454b-bfda-dad75235f6bf',
  'bf03b02e-1976-4ded-9aaf-bbc3d07c173d',
  'a5bd38bd-b729-460f-8533-0ffc8aec7feb',
  '2477d43e-26f9-46f3-9820-3d03ed2de98d',
  'fbc9e884-2637-4e92-9593-901e59cfa232',
  '851f7791-2d12-4832-b03e-7f42d936a320',
  'a8740f0f-9ded-4d4a-af15-096a4229c995',
  'aeaab4de-2a21-4df4-a761-32bbfd487821',
];

const isBaltimoreOrg = (orgId :string) => (
  BALTIMORE_ORGS_WL.reduce((matchFound, id) => matchFound || (orgId === id), false)
);

// const PORTLAND_EMAILS_WL :string[] = [
//   '@portlandmaine.gov'
// ];

const PORTLAND_ORGS_WL :string[] = [
  '4d42d3b7-ecbe-4365-9746-eedf93239b3b',
  '49e0b1bb-87e8-46d4-ac7a-ece2150e4e70', // temporary test org
];

const isPortlandOrg = (orgId :string) => (
  // PORTLAND_ORGS_WL.reduce((matchFound, id) => matchFound || (orgId === id), false)
  true
);

// const isPortlandUser = () => {
//
//   const { email } = AuthUtils.getUserInfo();
//   return PORTLAND_EMAILS_WL.reduce((matchFound, domain) => matchFound || (!!email && email.endsWith(domain)), false);
// };

export {
  BALTIMORE_ORGS_WL,
  PORTLAND_ORGS_WL,
  isBaltimoreOrg,
  isPortlandOrg,
};
