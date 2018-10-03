/*
 * @flow
 */

import moment from 'moment';

import { isNonEmptyString } from './LangUtils';

function formatAsDate(value :string) :string {

  if (isNonEmptyString(value)) {
    const valueMoment :moment = moment(value);
    if (valueMoment.isValid()) {
      return valueMoment.format(moment.HTML5_FMT.DATE);
    }
  }
  return '';
}

function formatAsTime(value :string) :string {

  if (isNonEmptyString(value)) {
    const valueMoment :moment = moment(value);
    if (valueMoment.isValid()) {
      return valueMoment.format(moment.HTML5_FMT.TIME);
    }
  }
  return '';
}

function replaceDateTimeDate(datetime :string, date :string) :string {

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

function replaceDateTimeTime(datetime :string, time :string) :string {

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
  formatAsDate,
  formatAsTime,
  replaceDateTimeDate,
  replaceDateTimeTime,
};
