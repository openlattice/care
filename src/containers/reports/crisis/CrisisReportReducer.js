// @flow

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_CRISIS_REPORT,
  DELETE_CRISIS_REPORT,
  addOptionalCrisisReportContent,
  createMissingCallForService,
  deleteCrisisReport,
  deleteCrisisReportContent,
  getCrisisReport,
  getCrisisReportV2,
  submitCrisisReport,
  submitCrisisReportV2,
  updateCrisisReport,
} from './CrisisActions';

import resetRequestStatesReducer from '../../../core/redux/reducers/resetRequestStatesReducer';
import { RESET_REQUEST_STATES } from '../../../core/redux/actions';
import { REQUEST_STATE, RS_INITIAL_STATE } from '../../../core/redux/constants';
import { APP_TYPES_FQNS } from '../../../shared/Consts';

const {
  CRISIS_REPORT_CLINICIAN_FQN,
  CRISIS_REPORT_FQN,
} = APP_TYPES_FQNS;

const INITIAL_STATE :Map = fromJS({
  [DELETE_CRISIS_REPORT]: RS_INITIAL_STATE,
  [CRISIS_REPORT_CLINICIAN_FQN]: Map(),
  [CRISIS_REPORT_FQN]: Map(),
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: Map(),
  reportData: Map(),
  reporterData: Map(),
  subjectData: Map(),
  submitState: RequestStates.STANDBY,
  updateState: RequestStates.STANDBY,
});

export default function crisisReportReducer(state :Map = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case submitCrisisReport.case(action.type): {
      return submitCrisisReport.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('submitState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('submitState', RequestStates.FAILURE),
      });
    }

    case submitCrisisReportV2.case(action.type): {
      return submitCrisisReportV2.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('submitState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('submitState', RequestStates.FAILURE),
      });
    }

    case getCrisisReport.case(action.type): {
      return getCrisisReport.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case getCrisisReportV2.case(action.type): {
      return getCrisisReportV2.reducer(state, action, {
        REQUEST: () => INITIAL_STATE.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state
          .set('fetchState', RequestStates.FAILURE)
          .set('error', action.value)
      });
    }

    case updateCrisisReport.case(action.type): {
      return updateCrisisReport.reducer(state, action, {
        REQUEST: () => {
          const { path, properties } = action.value;
          return state
            .set('updateState', RequestStates.PENDING)
            .setIn(['formData', ...path], fromJS(properties));
        },
        SUCCESS: () => state.set('updateState', RequestStates.SUCCESS),
        FAILURE: () => state.set('updateState', RequestStates.FAILURE),
      });
    }

    case deleteCrisisReportContent.case(action.type): {
      return deleteCrisisReportContent.reducer(state, action, {
        REQUEST: () => state.set('deleteState', RequestStates.PENDING),
        SUCCESS: () => {
          const { entityIndexToIdMap, path } = action.value;
          return state
            .set('deleteState', RequestStates.SUCCESS)
            .set('entityIndexToIdMap', entityIndexToIdMap)
            .deleteIn(['formData', ...path]);
        },
        FAILURE: () => state.set('deleteState', RequestStates.FAILURE)
      });
    }

    case addOptionalCrisisReportContent.case(action.type): {
      return addOptionalCrisisReportContent.reducer(state, action, {
        REQUEST: () => state.set('updateState', RequestStates.PENDING),
        SUCCESS: () => {
          const { entityIndexToIdMap, path, properties } = action.value;
          return state
            .set('updateState', RequestStates.SUCCESS)
            .mergeDeepIn(['entityIndexToIdMap'], entityIndexToIdMap)
            .setIn(['formData', ...path], properties);
        },
        FAILURE: () => state.set('updateState', RequestStates.FAILURE)
      });
    }

    case createMissingCallForService.case(action.type): {
      return createMissingCallForService.reducer(state, action, {
        SUCCESS: () => {
          const { entityIndexToIdMap } = action.value;
          return state.mergeDeepIn(['entityIndexToIdMap'], entityIndexToIdMap);
        }
      });
    }

    case deleteCrisisReport.case(action.type): {
      return deleteCrisisReport.reducer(state, action, {
        REQUEST: () => state.setIn([DELETE_CRISIS_REPORT, REQUEST_STATE], RequestStates.PENDING),
        SUCCESS: () => state.setIn([DELETE_CRISIS_REPORT, REQUEST_STATE], RequestStates.SUCCESS),
        FAILURE: () => state.setIn([DELETE_CRISIS_REPORT, REQUEST_STATE], RequestStates.FAILURE),
      });
    }

    case CLEAR_CRISIS_REPORT: {
      return INITIAL_STATE;
    }

    case RESET_REQUEST_STATES: {
      return resetRequestStatesReducer(state, action);
    }

    default:
      return state;
  }
}
