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
    return moment(timeString, moment.HTML5_FMT.TIME).format('HH:mm:00Z');
  }

  return '';
}

function replaceDateTimeDate(datetime :string, date :string) {

  // TODO: this should be the default behavior some of the time, but what about the rest?
  let datetimeMomemt :moment = moment().set({ hour: 0, minute: 0, second: 0 });
  if (isNonEmptyString(datetime)) {
    datetimeMomemt = moment(datetime);
  }

  let dateMoment :moment = moment();
  if (isNonEmptyString(date)) {
    dateMoment = moment(date, moment.HTML5_FMT.DATE);
  }

  const dt = datetimeMomemt.set({
    year: dateMoment.year(),
    month: dateMoment.month(),
    date: dateMoment.date(),
  }).format();

  return dt;
}

function replaceDateTimeTime(datetime :string, time :string) {

  // TODO: this should be the default behavior some of the time, but what about the rest?
  let datetimeMomemt :moment = moment().set({ hour: 0, minute: 0, second: 0 });
  if (isNonEmptyString(datetime)) {
    datetimeMomemt = moment(datetime);
  }

  let timeMoment :moment = moment();
  if (isNonEmptyString(time)) {
    timeMoment = moment(time, moment.HTML5_FMT.TIME);
  }

  const dt = datetimeMomemt.set({
    hour: timeMoment.hour(),
    minute: timeMoment.minute(),
    second: timeMoment.second(),
  }).format();

  return dt;
}

export {
  formatDateWithTZOAsZeros,
  formatTimeWithSecondsAsZeros,
  replaceDateTimeDate,
  replaceDateTimeTime,
};
