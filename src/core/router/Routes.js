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

export const REPORT_SUMMARIES :string = '/reportsummaries';
export const REPORT_SUMMARIES_PATH :string = `${HOME}${REPORT_SUMMARIES}`;
export const PAGE_1 :string = `${REPORT_SUMMARIES_PATH}/1`;
export const PAGE_2 :string = `${REPORT_SUMMARIES_PATH}/2`;
