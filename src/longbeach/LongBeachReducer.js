// @flow
import { combineReducers } from 'redux-immutable';

import locations from './location/LongBeachLocationsReducer';
import people from './people/LongBeachPeopleReducer';

const subReducers = combineReducers({
  people,
  locations,
  // providers
});

export default subReducers;
