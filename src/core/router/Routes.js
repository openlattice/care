/*
 * @flow
 */

// injected by Webpack.DefinePlugin
declare var __BASE_PATH__;

export const ROOT :string = '/';
export const HOME :string = '/home';
export const LOGIN :string = '/login';

const CREATE_REPORT :string = '/createreport';
export const CREATE_REPORT_PATH :string = `${HOME}${CREATE_REPORT}`;
export const BHR :string = '/bhr';
export const FOLLOW_UP_PATH :string = '/followup';
export const CONSUMER_SUMMARY :string = '/consumersummary';
export const CONSUMER_SUMMARY_PATH :string = `${HOME}${CONSUMER_SUMMARY}`;
