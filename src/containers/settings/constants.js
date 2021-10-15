// @flow

type PrivateSetting = {|
  label :string;
  name :string;
|};

const profile :PrivateSetting = Object.freeze({
  label: 'Profile',
  name: 'profile'
});

const deleteReports :PrivateSetting = Object.freeze({
  label: 'Delete Reports',
  name: 'deleteReports',
});

const adminOnly :PrivateSetting = Object.freeze({
  label: 'Admin Only',
  name: 'adminOnly'
});

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
const CLINICIAN_REPORTS = 'clinicianReports';

export {
  CLINICIAN_REPORTS,
  CRISIS_PROFILE_REPORT_THRESHOLD,
  INTEGRATED_RMS,
  MONTHS,
  PRIVATE_SETTINGS,
  THRESHOLD,
  V1,
  V2,
  adminOnly,
};

export type {
  PrivateSetting
};
