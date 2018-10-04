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
  DEESCALATION_TECHNIQUES,
  DISPOSITIONS,
  DISPOSITIONS_PORTLAND,
  SUMMARY_STATS
} from '../../shared/Consts';

import {
  AGE_FQN,
  DATE_TIME_OCCURRED_FQN,
  DEESCALATION_TECHNIQUES_FQN,
  DISPOSITION_FQN,
  DRUGS_ALCOHOL_FQN,
  GENDER_FQN,
  HOMELESS_FQN,
  MILITARY_STATUS_FQN,
  RACE_FQN,
  SPECIAL_RESOURCES_CALLED_FQN
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
  getReportESId,
  getSelectedOrganizationId
} from '../../utils/AppUtils';

import { isPortlandOrg } from '../../utils/Whitelist';

import { getFqnObj } from '../../utils/DataUtils';

const DATE_FORMAT = 'YYYY-MM-DD';

const toLower = list => list.map(o => o.toLowerCase());

function* loadDashboardDataWorker(action :SequenceAction) :Generator<*, *, *>  {
  try  {
    yield put(loadDashboardData.request(action.id));
    const {
      app
    } = action.value;

    const isPortland = isPortlandOrg(getSelectedOrganizationId(app));
    const reportESId :string = getReportESId(app);

    const ceiling = yield call(DataApi.getEntitySetSize, reportESId);
    const datePropertyTypeId = yield call(EntityDataModelApi.getPropertyTypeId, DATE_TIME_OCCURRED_FQN);
    const bhrs = yield call(SearchApi.searchEntitySetData, reportESId, {
      searchTerm: '*',
      // searchTerm: `${datePropertyTypeId}:[${moment().subtract(1, 'month').format(DATE_FORMAT)} TO *]`,
      start: 0,
      maxHits: ceiling,
      // fuzzy: false
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
    let dispositionCounts = Map();
    let deescalationCounts = Map();
    let resourceCounts = Map();
    let dispositionsByDeescalation = Map();

    const dispositionsList = isPortland ? Object.values(DISPOSITIONS_PORTLAND) : Object.values(DISPOSITIONS);
    Object.values(DEESCALATION_TECHNIQUES).forEach((deescTechnique) => {
      dispositionsList.forEach((disp) => {
        dispositionsByDeescalation = dispositionsByDeescalation.setIn([deescTechnique, disp], 0);
      });
    });

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

      bhr.get(DISPOSITION_FQN, List()).forEach((disposition) => {
        dispositionCounts = dispositionCounts.set(disposition, dispositionCounts.get(disposition, 0) + 1);
      });

      bhr.get(DEESCALATION_TECHNIQUES_FQN, List()).forEach((technique) => {
        deescalationCounts = deescalationCounts.set(technique, deescalationCounts.get(technique, 0) + 1);
      });

      bhr.get(SPECIAL_RESOURCES_CALLED_FQN, List()).forEach((resource) => {
        resourceCounts = resourceCounts.set(resource, resourceCounts.get(resource, 0) + 1);
      });

      // bhr.get(DEESCALATION_TECHNIQUES_FQN, List()).forEach((deescTechnique) => {
      //   bhr.get(DISPOSITION_FQN, List()).forEach((disp) => {
      //     dispositionsByDeescalation = dispositionsByDeescalation.setIn([deescTechnique, disp],
      //       dispositionsByDeescalation.getIn([deescTechnique, disp], 0) + 1);
      //   });
      // });

      // /* HACK TO MAKE HISTORICAL DATA WORK */
      const deescInputList = bhr.get(DEESCALATION_TECHNIQUES_FQN, List()).join(' ').toLowerCase().split(' ');
      const deescList = Object.values(DEESCALATION_TECHNIQUES).filter(deesc => deescInputList.includes(deesc));
      if (deescInputList.includes('leg')) deescList.push(DEESCALATION_TECHNIQUES.LEG_RESTRAINTS);
      if (deescInputList.includes('arrest')) deescList.push(DEESCALATION_TECHNIQUES.ARREST_CONTROL);
      if (!deescList.length) deescList.push(DEESCALATION_TECHNIQUES.N_A);

      const dispInputList = bhr.get(DISPOSITION_FQN, List()).join(' ').toLowerCase().split(' ');
      const dispList = dispositionsList.filter(disp => dispInputList.includes(disp));
      if (dispInputList.includes('voluntary')) dispList.push(DISPOSITIONS.VOLUNTARY_ER);
      if (dispInputList.includes('referral') || dispInputList.includes('information/referral')) dispList.push(DISPOSITIONS.INFO_AND_REFERRAL);
      if (dispInputList.includes('provider')) dispList.push(DISPOSITIONS.CONTACTED_PROVIDER);
      if (dispInputList.includes('criminal')) dispList.push(DISPOSITIONS.CRIMINAL_CITATION);
      if (dispInputList.includes('civil')) dispList.push(DISPOSITIONS.CIVIL_CITATION);

      deescList.forEach((deescTechnique) => {
        dispList.forEach((disp) => {
          dispositionsByDeescalation = dispositionsByDeescalation.setIn([deescTechnique, disp],
            dispositionsByDeescalation.getIn([deescTechnique, disp], 0) + 1);
        });
      });
      // </HACK>

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
      [DASHBOARD_COUNTS.REPORTS_BY_DAY_OF_WEEK]: dayAndTimeCounts,
      [DASHBOARD_COUNTS.DISPOSITIONS]: dispositionCounts,
      [DASHBOARD_COUNTS.DEESCALATION]: deescalationCounts,
      [DASHBOARD_COUNTS.RESOURCES]: resourceCounts,
      [DASHBOARD_COUNTS.DISPOSITIONS_BY_DEESCALATION]: dispositionsByDeescalation
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
