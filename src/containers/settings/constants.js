// @flow

type PrivateSetting = {|
  label :string;
  name :string;
|};

const profile :PrivateSetting = {
  label: 'Profile',
  name: 'profile'
};

const deleteReports :PrivateSetting = {
  label: 'Delete Reports',
  name: 'deleteReports',
};

const adminOnly :PrivateSetting = {
  label: 'Admin Only',
  name: 'adminOnly'
};

const PRIVATE_SETTINGS = Object.freeze({
  deleteReports,
  profile,
});

const V1 = 'v1';
const V2 = 'v2';
const INTEGRATED_RMS = 'integratedRMS';
const CRISIS_PROFILE_REPORT_THRESHOLD = 'crisisProfileReportThreshold';
const THRESHOLD = 'threshold';
const MONTHS = 'months';

export {
  adminOnly,
  CRISIS_PROFILE_REPORT_THRESHOLD,
  INTEGRATED_RMS,
  MONTHS,
  PRIVATE_SETTINGS,
  THRESHOLD,
  V1,
  V2,
};

export type {
  PrivateSetting
};
