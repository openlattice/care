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
export const EDIT_PATH :string = '/edit';

export const REPORT_ID_PARAM :string = 'reportId';
export const REPORT_ID_PATH :string = `:${REPORT_ID_PARAM}`;
export const REPORT_EDIT_PATH :string = `${REPORTS_PATH}/${REPORT_ID_PATH}${EDIT_PATH}`;
export const REPORT_VIEW_PATH :string = `${REPORTS_PATH}/${REPORT_ID_PATH}/view`;

export const PROFILE_ID_PARAM :string = 'profileId';
export const PROFILE_ID_PATH :string = `:${PROFILE_ID_PARAM}`;
export const PROFILE_PATH :string = `${PEOPLE_PATH}/${PROFILE_ID_PATH}`;
export const PROFILE_EDIT_PATH :string = `${PROFILE_PATH}${EDIT_PATH}`;

export const BASIC_PATH :string = '/basic-information';
export const OFFICER_SAFETY_PATH :string = '/officer-safety';
export const RESPONSE_PLAN_PATH :string = '/response-plan';
export const CONTACTS_PATH :string = '/contacts';
export const ABOUT_PATH :string = '/about';
