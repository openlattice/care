/*
 * @flow
 */

import moment from 'moment';

import { isNonEmptyString } from './LangUtils';

// TZO = timezone and offset
function formatDateWithTZOAsZeros(value :?string) :string {

  const dateString :string = value || '';
  if (isNonEmptyString(dateString)) {
    return moment(dateString).utc().set({ hour: 0, minute: 0, second: 0 }).format();
  }

  return '';
}

function formatTimeWithSecondsAsZeros(value :?string) :string {

  const timeString :string = value || '';
  if (isNonEmptyString(value)) {
    return moment(timeString, moment.HTML5_FMT.TIME).format('HH:mm:00');
  }

  return '';
}

export {
  formatDateWithTZOAsZeros,
  formatTimeWithSecondsAsZeros,
};
