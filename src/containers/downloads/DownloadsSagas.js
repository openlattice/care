/*
 * @flow
 */
import Immutable, { fromJS, Map } from 'immutable';
import Papa from 'papaparse';
import moment from 'moment';
import {
  Constants,
  DataApi,
  EntityDataModelApi,
  SearchApi
} from 'lattice';
import { call, put, takeEvery } from 'redux-saga/effects';

import FileSaver from '../../utils/FileSaver';
import {
  DATE_TIME_OCCURRED_FQN,
  STRING_ID_FQN,
  OL_ID_FQN
} from '../../edm/DataModelFqns';
import {
  DOWNLOAD_FORMS,
  downloadForms
} from './DownloadsActionFactory';
import { getReportESId, getPeopleESId, getAppearsInESId } from '../../utils/AppUtils';

const { OPENLATTICE_ID_FQN } = Constants;

const HIDDEN_FQNS = [
  OPENLATTICE_ID_FQN,
  STRING_ID_FQN.toString(),
  OL_ID_FQN.toString(),
  'id'
];

function* downloadFormsWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(downloadForms.request(action.id));
    const {
      app,
      startDate,
      endDate
    } = action.value;

    const start = moment(startDate);
    const end = moment(endDate);
    const reportEntitySetId = getReportESId(app);
    const peopleEntitySetId = getPeopleESId(app);
    const appearsInEntitySetId = getAppearsInESId(app);

    const projection = yield call(EntityDataModelApi.getEntityDataModelProjection,
      [reportEntitySetId, peopleEntitySetId, appearsInEntitySetId].map(id => ({
        id,
        type: 'EntitySet',
        include: ['EntitySet', 'PropertyTypeInEntitySet']
      })));

    let propertyTypesByFqn = Map();
    Object.values(projection.propertyTypes).forEach((propertyType) => {
      const { type } = propertyType;
      const { name, namespace } = type;
      propertyTypesByFqn = propertyTypesByFqn.set(`${namespace}.${name}`, fromJS(propertyType));
    });

    const propertyTypeId = propertyTypesByFqn.getIn([DATE_TIME_OCCURRED_FQN, 'id']);
    const entitySetSize = yield call(DataApi.getEntitySetSize, reportEntitySetId);
    const options = {
      searchTerm: `${propertyTypeId}: [${start.toISOString(true)} TO ${end.toISOString(true)}]`,
      start: 0,
      maxHits: entitySetSize,
      fuzzy: false
    };

    const reportData = yield call(SearchApi.searchEntitySetData, reportEntitySetId, options);

    let reportsAsMap = Map();
    reportData.hits.forEach((row) => {
      reportsAsMap = reportsAsMap.set(row[OPENLATTICE_ID_FQN][0], fromJS(row));
    });

    let neighborsById = yield call(
      SearchApi.searchEntityNeighborsBulk,
      reportEntitySetId,
      reportsAsMap.keySeq().toJS()
    );
    neighborsById = fromJS(neighborsById);

    const getUpdatedEntity = (combinedEntityInit, entitySetName, details) => {
      let combinedEntity = combinedEntityInit;
      details.keySeq().forEach((fqn) => {
        if (!HIDDEN_FQNS.includes(fqn)) {
          const header = propertyTypesByFqn.getIn([fqn, 'title'], `${fqn}|${entitySetName}`);
          if (header) {
            let newArrayValues = combinedEntity.get(header, Immutable.List());
            details.get(fqn).forEach((val) => {
              if (!newArrayValues.includes(val)) {
                newArrayValues = newArrayValues.push(val);
              }
            });
            combinedEntity = combinedEntity.set(header, newArrayValues);
          }
        }
      });
      return combinedEntity;
    };

    let jsonResults = Immutable.List();
    let allHeaders = Immutable.Set();
    neighborsById.keySeq().forEach((id) => {
      let combinedEntity = getUpdatedEntity(
        Immutable.Map(),
        'BHRs',
        reportsAsMap.get(id)
      );

      neighborsById.get(id).forEach((neighbor) => {
        combinedEntity = getUpdatedEntity(
          combinedEntity,
          neighbor.getIn(['associationEntitySet', 'name']),
          neighbor.get('associationDetails', Map())
        );
        combinedEntity = getUpdatedEntity(
          combinedEntity,
          neighbor.getIn(['neighborEntitySet', 'name']),
          neighbor.get('neighborDetails', Map())
        );
        allHeaders = allHeaders.union(combinedEntity.keys());
      });

      jsonResults = jsonResults.push(combinedEntity);
    });

    const fields = allHeaders.toJS();
    const csv = Papa.unparse({
      fields,
      data: jsonResults.toJS()
    });

    const name = `BHRs-${start.format('MM-DD-YYYY')}-to-${end.format('MM-DD-YYYY')}`;

    FileSaver.saveFile(csv, name, 'csv');

    yield put(downloadForms.success(action.id));
  }
  catch (error) {
    console.error(error);
    yield put(downloadForms.failure(action.id, { error }));
  }
  finally {
    yield put(downloadForms.finally(action.id));
  }
}

export function* downloadFormsWatcher() :Generator<*, *, *> {
  yield takeEvery(DOWNLOAD_FORMS, downloadFormsWorker);
}
