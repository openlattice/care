// @flow
import { combineReducers } from 'redux-immutable';

import locations from './location/LongBeachLocationsReducer';
import people from './people/LongBeachPeopleReducer';
import profile from './profile/LongBeachProfileReducer';

const subReducers = combineReducers({
  locations,
  people,
  profile,
  // providers
});

export default subReducers;
