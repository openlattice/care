/*
 * @flow
 */

import { OrderedSet } from 'immutable';

import * as AppActions from './AppActions';
import { testShouldExportActionTypes, testShouldExportRequestSequences } from '../../utils/testing/TestUtils';

const ACTION_TYPES = OrderedSet([
  'INITIALIZE_APPLICATION',
  'LOAD_APP',
  'LOAD_HOSPITALS',
  'SWITCH_ORGANIZATION',
]).sort().toJS();

const REQSEQ_NAMES = OrderedSet([
  'initializeApplication',
  'loadApp',
  'loadHospitals',
  'switchOrganization',
]).sort().toJS();

describe('AppActions', () => {

  testShouldExportActionTypes(AppActions, ACTION_TYPES);
  testShouldExportRequestSequences(AppActions, ACTION_TYPES, REQSEQ_NAMES);
});
