// @flow
import { OrderedMap } from 'immutable';

const reportLabels = OrderedMap({
  lastName: 'Last Name',
  firstName: 'First Name',
  middleName: 'Middle Name',
  dob: 'DOB'
});

const reportSearchFields = [
  {
    id: 'dateStart',
    label: 'Date Range Start',
    type: 'date'
  },
  {
    id: 'dateEnd',
    label: 'Date Range End',
    type: 'date'
  }
];

export {
  reportLabels,
  reportSearchFields,
};
