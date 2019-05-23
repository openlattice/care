// @flow
import { Map } from 'immutable';

const resultLabels = Map({
  lastName: 'Last name',
  firstName: 'First name',
  middleName: 'Middle name',
  sex: 'Sex',
  gender: 'Gender',
  ethnicity: 'Ethnicity',
  dob: 'DOB',
  identifier: 'Identifier',
});

const searchFields = [
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
  resultLabels,
  searchFields,
};
