// @flow
import { Map } from 'immutable';

const personLabels = Map({
  lastName: 'Last name',
  firstName: 'First name',
  middleName: 'Middle name',
  sex: 'Sex',
  gender: 'Gender',
  ethnicity: 'Ethnicity',
  dob: 'DOB',
  identifier: 'Identifier',
});

const personSearchFields = [
  {
    id: 'lastName',
    label: 'Last Name',
  },
  {
    id: 'firstName',
    label: 'First Name',
  },
  {
    id: 'dob',
    label: 'Date of Birth',
    type: 'date'
  }
];

export {
  personLabels,
  personSearchFields,
};
