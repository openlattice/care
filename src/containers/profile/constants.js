// @flow
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

const generateOptions = (list :string[]) :Object[] => list.map((value) => ({
  label: value,
  value
}));

// https://nief.org/attribute-registry/codesets/NCICSexCode/
const SEX_VALUES = [
  'Female',
  'Male',
  'Unknown'
];
const sexOptions = generateOptions(SEX_VALUES);

const RACE_VALUES = [
  'American Indian',
  'Asian / Pacific Islander',
  'Black / African American',
  'Hispanic (Non-White)',
  'White',
  'Unknown',
];
const raceOptions = generateOptions(RACE_VALUES);

// https://nief.org/attribute-registry/codesets/NCICEyeColorCode/
const EYE_COLOR_VALUES = [
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
];
const eyeOptions = generateOptions(EYE_COLOR_VALUES);

// https://nief.org/attribute-registry/codesets/NCICHairColorCode/
const HAIR_COLOR_VALUES = [
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
];
const hairOptions = generateOptions(HAIR_COLOR_VALUES);

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
  EYE_COLOR_VALUES,
  HAIR_COLOR_VALUES,
  RACE_VALUES,
  SEX_VALUES,
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
