import { OrderedMap } from 'immutable';
import * as FQN from '../../edm/DataModelFqns';

const labelMapReport = OrderedMap({
  [FQN.DATE_TIME_OCCURRED_FQN]: 'Incident Date',
  [FQN.DISPATCH_REASON_FQN]: 'Nature'
});

const labelMapNames = OrderedMap({
  [FQN.PERSON_LAST_NAME_FQN]: 'Last Name',
  [FQN.PERSON_MIDDLE_NAME_FQN]: 'Middle Name',
  [FQN.PERSON_FIRST_NAME_FQN]: 'First Name'
});

const labelMapDobAlias = OrderedMap({
  [FQN.PERSON_DOB_FQN]: 'DOB',
  [FQN.PERSON_NICK_NAME_FQN]: 'Aliases'
});

const labelMapAttributes = OrderedMap({
  [FQN.PERSON_RACE_FQN]: 'Race',
  [FQN.PERSON_SEX_FQN]: 'Sex',
  [FQN.HEIGHT_FQN]: 'Height',
  [FQN.WEIGHT_FQN]: 'Weight',
  [FQN.HAIR_COLOR_FQN]: 'Hair Color',
  [FQN.EYE_COLOR_FQN]: 'Eye Color',
});

const generateOptions = (list :string[]) => list.map(value => ({
  label: value,
  value
}));

// https://nief.org/attribute-registry/codesets/NCICSexCode/
const sexOptions = generateOptions([
  'Female',
  'Male',
  'Unknown'
]);

const raceOptions = generateOptions([
  'American Indian',
  'Asian / Pacific Islander',
  'Black / African American',
  'Hispanic (Non-White)',
  'White',
  'Unknown',
]);

// https://nief.org/attribute-registry/codesets/NCICEyeColorCode/
const eyeOptions = generateOptions([
  'Black',
  'Blue',
  'Brown',
  'Gray',
  'Green',
  'Hazel',
  'Maroon',
  'Multicolored',
  'Pink',
  'Unknown',
]);

// https://nief.org/attribute-registry/codesets/NCICHairColorCode/
const hairOptions = generateOptions([
  'Bald',
  'Black',
  'Blond',
  'Blue',
  'Brown',
  'Gray',
  'Green',
  'Orange',
  'Pink',
  'Purple',
  'Red',
  'Sandy',
  'White',
  'Unknown',
]);

const personFqnsByName = {
  aliases: FQN.PERSON_NICK_NAME_FQN,
  dob: FQN.PERSON_DOB_FQN,
  firstName: FQN.PERSON_FIRST_NAME_FQN,
  lastName: FQN.PERSON_LAST_NAME_FQN,
  middleName: FQN.PERSON_MIDDLE_NAME_FQN,
  race: FQN.PERSON_RACE_FQN,
  sex: FQN.PERSON_SEX_FQN,
};

const physicalAppearanceFqnsByName = {
  eyeColor: FQN.EYE_COLOR_FQN,
  hairColor: FQN.HAIR_COLOR_FQN,
  height: FQN.HEIGHT_FQN,
  weight: FQN.WEIGHT_FQN
};

export {
  eyeOptions,
  hairOptions,
  labelMapAttributes,
  labelMapDobAlias,
  labelMapNames,
  labelMapReport,
  personFqnsByName,
  physicalAppearanceFqnsByName,
  raceOptions,
  sexOptions,
};
