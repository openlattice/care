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

const PRIVATE_SETTINGS = Object.freeze({
  deleteReports,
  profile,
});

export {
  PRIVATE_SETTINGS
};

export type {
  PrivateSetting
};
