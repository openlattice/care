// @flow
import { combineReducers } from 'redux-immutable';

import locations from './location/LocationsReducer';
import people from './people/LongBeachPeopleReducer';
import profile from './profile/LongBeachProfileReducer';
import providers from './provider/LongBeachProviderReducer';

const subReducers = combineReducers({
  locations,
  people,
  profile,
  providers
});

export default subReducers;
