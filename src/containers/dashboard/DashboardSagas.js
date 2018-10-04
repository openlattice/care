/*
 * @flow
 */

/* eslint-disable no-use-before-define */

import axios from 'axios';
import moment from 'moment';
import { List, Map, fromJS } from 'immutable';
import { DataApi, EntityDataModelApi, Models, SearchApi } from 'lattice';
import { DataIntegrationApiActionFactory, DataIntegrationApiSagas } from 'lattice-sagas';
import { call, put, takeEvery } from 'redux-saga/effects';

import {
  APP_TYPES_FQNS,
  DASHBOARD_COUNTS,
  SUMMARY_STATS
} from '../../shared/Consts';

import {
  AGE_FQN,
  DATE_TIME_OCCURRED_FQN,
  DRUGS_ALCOHOL_FQN,
  GENDER_FQN,
  HOMELESS_FQN,
  MILITARY_STATUS_FQN,
  RACE_FQN
} from '../../edm/DataModelFqns';

import {
  DATE_STR,
  TIME_STR
} from '../../utils/DateUtils';

import {
  LOAD_DASHBOARD_DATA,
  loadDashboardData
} from './DashboardActionFactory';

import {
  getPeopleESId,
  getReportESId
} from '../../utils/AppUtils';

import { getFqnObj } from '../../utils/DataUtils';

const DATE_FORMAT = 'YYYY-MM-DD';

const toLower = list => list.map(o => o.toLowerCase());

function* loadDashboardDataWorker(action :SequenceAction) :Generator<*, *, *>  {
  try  {
    yield put(loadDashboardData.request(action.id));
    const {
      app
    } = action.value;

    const reportESId :string = getReportESId(app);

    const ceiling = yield call(DataApi.getEntitySetSize, reportESId);
    const datePropertyTypeId = yield call(EntityDataModelApi.getPropertyTypeId, DATE_TIME_OCCURRED_FQN);
    const bhrs = yield call(SearchApi.searchEntitySetData, reportESId, {
      searchTerm: `${datePropertyTypeId}:[${moment().subtract(1, 'month').format(DATE_FORMAT)} TO *]`,
      start: 0,
      maxHits: ceiling,
      fuzzy: false
    });

    const numReports = bhrs.hits.length;

    let ageTotal = 0;
    let numHomeless = 0;
    let numMale = 0;
    let numVeterans = 0;
    let numUsingSubstance = 0;
    let numUsingAlcohol = 0;
    let numUsingDrugs = 0;

    let raceCounts = Map();
    let ageCounts = Map();
    let genderCounts = Map();
    let dateCounts = Map();
    let timeCounts = Map();
    let dayAndTimeCounts = Map();

    fromJS(bhrs.hits).forEach((bhr) => {

      /* Summary Stats */
      ageTotal += bhr.getIn([AGE_FQN, 0], 0);

      const genderList = toLower(bhr.get(GENDER_FQN, List()));
      const raceList = toLower(bhr.get(RACE_FQN, List()));
      const militaryStatusList = toLower(bhr.get(MILITARY_STATUS_FQN, List()));
      const substanceList = toLower(bhr.get(DRUGS_ALCOHOL_FQN, List()));

      if (bhr.getIn([HOMELESS_FQN, 0], false)) {
        numHomeless += 1;
      }

      if (genderList.includes('male')) {
        numMale += 1;
      }

      if (militaryStatusList.includes('veteran')) {
        numVeterans += 1;
      }

      if (substanceList.includes('drugs')) {
        numUsingDrugs += 1;
      }
      if (substanceList.includes('alcohol')) {
        numUsingAlcohol += 1;
      }
      if (substanceList.includes('both')) {
        numUsingSubstance += 1;
      }

      /* Dashboard Counts */
      raceList.forEach((race) => {
        raceCounts = raceCounts.set(race, raceCounts.get(race, 0) + 1);
      });

      genderList.forEach((gender) => {
        genderCounts = genderCounts.set(gender, genderCounts.get(gender, 0) + 1)
      });

      bhr.get(AGE_FQN, List()).forEach((age) => {
        ageCounts = ageCounts.set(age, ageCounts.get(age, 0) + 1);
      });

      bhr.get(DATE_TIME_OCCURRED_FQN, bhr.get('bhr.dateOccurred', List())).forEach((date) => {
        const dateMoment = moment(date);
        if (dateMoment.isValid()) {
          const dateStr = dateMoment.format(DATE_STR);
          const timeStr = dateMoment.format(TIME_STR);
          const dayOfWeek = dateMoment.format('ddd');
          const timeHr = dateMoment.format('H');
          dateCounts = dateCounts.set(dateStr, dateCounts.get(dateStr, 0) + 1);
          timeCounts = timeCounts.set(timeStr, timeCounts.get(timeStr, 0) + 1);
          dayAndTimeCounts = dayAndTimeCounts.setIn([dayOfWeek, timeHr], dayAndTimeCounts.getIn([dayOfWeek, timeHr], 0) + 1);
        }
      });

    });

    const summaryStats = {
      [SUMMARY_STATS.NUM_REPORTS]: numReports,
      [SUMMARY_STATS.AVG_AGE]: ageTotal / numReports,
      [SUMMARY_STATS.NUM_HOMELESS]: numHomeless,
      [SUMMARY_STATS.NUM_MALE]: numMale,
      [SUMMARY_STATS.NUM_VETERANS]: numVeterans,
      [SUMMARY_STATS.NUM_USING_SUBSTANCE]: numUsingSubstance,
      [SUMMARY_STATS.NUM_USING_ALCOHOL]: numUsingAlcohol,
      [SUMMARY_STATS.NUM_USING_DRUGS]: numUsingDrugs
    };

    const dashboardCounts = {
      [DASHBOARD_COUNTS.RACE]: raceCounts,
      [DASHBOARD_COUNTS.AGE]: ageCounts,
      [DASHBOARD_COUNTS.GENDER]: genderCounts,
      [DASHBOARD_COUNTS.REPORTS_BY_DATE]: dateCounts,
      [DASHBOARD_COUNTS.REPORTS_BY_TIME]: timeCounts,
      [DASHBOARD_COUNTS.REPORTS_BY_DAY_OF_WEEK]: dayAndTimeCounts
    };

    yield put(loadDashboardData.success(action.id, { summaryStats, dashboardCounts }));
  }
  catch (error)  {
    console.error(error);
    yield put(loadDashboardData.failure(action.id, error));
  }
  finally {
    yield put(loadDashboardData.finally(action.id));
  }
}

export function* loadDashboardDataWatcher() :Generator<*, *, *> {
  yield takeEvery(LOAD_DASHBOARD_DATA, loadDashboardDataWorker);
}
