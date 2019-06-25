/*
 * @flow
 */

// injected by Webpack.DefinePlugin
declare var __BASE_PATH__;

export const ROOT :string = '/';

export const CRISIS_PATH :string = '/crisis';
export const HOME_PATH :string = '/home';
export const REPORTS_PATH :string = '/reports';
export const DASHBOARD_PATH :string = '/dashboard';
export const DOWNLOADS_PATH :string = '/downloads';
export const PEOPLE_PATH :string = '/people';
export const SUBSCRIBE_PATH :string = '/subscribe';

export const REPORT_ID_PARAM :string = 'reportId';
export const REPORT_ID_PATH :string = `:${REPORT_ID_PARAM}`;
export const REPORT_EDIT_PATH :string = `${REPORTS_PATH}/${REPORT_ID_PATH}/edit`;
export const REPORT_VIEW_PATH :string = `${REPORTS_PATH}/${REPORT_ID_PATH}/view`;

export const PROFILE_ID_PARAM :string = 'profileId';
export const PROFILE_ID_PATH :string = `:${PROFILE_ID_PARAM}`;
export const PROFILE_PATH :string = `${PEOPLE_PATH}/${PROFILE_ID_PATH}`;
export const PROFILE_PATH_PREMIUM :string = `${PEOPLE_PATH}/${PROFILE_ID_PATH}/premium`;
