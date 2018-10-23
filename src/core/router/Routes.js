/*
 * @flow
 */

// injected by Webpack.DefinePlugin
declare var __BASE_PATH__;

export const ROOT :string = '/';

export const BHR_PATH :string = '/bhr';
export const FOLLOW_UP_PATH :string = '/followup';
export const HOME_PATH :string = '/home';
export const REPORTS_PATH :string = '/reports';
export const DASHBOARD_PATH :string = '/dashboard';
export const PEOPLE_PATH :string = '/people';

export const REPORT_ID_PARAM :string = ':reportId';
export const REPORT_EDIT_PATH :string = `${REPORTS_PATH}/${REPORT_ID_PARAM}/edit`;
export const REPORT_VIEW_PATH :string = `${REPORTS_PATH}/${REPORT_ID_PARAM}/view`;
