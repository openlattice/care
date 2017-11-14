/*
 * @flow
 */

import { all, put, take, takeEvery } from 'redux-saga/effects';

import { ENTITY_SET_NAMES } from '../../shared/Consts';

import {
  fetchEntityDataModelProjection,
  fetchEntitySetId
} from '../../core/lattice/LatticeActionFactory';

import {
  LOAD_DATA_MODEL,
  loadDataModel
} from './EntitySetsActionFactory';

import type { SequenceAction } from '../../core/redux/RequestSequence';

/*
 * helper functions
 */

function matchFetchEntitySetIdSuccess(fetchEntitySetIdAction :SequenceAction) {
  return (anAction :Object) => {
    return anAction.type === fetchEntitySetId.SUCCESS && anAction.id === fetchEntitySetIdAction.id;
  };
}

function matchFetchProjectionSuccess(fetchProjectionAction :SequenceAction) {
  return (anAction :Object) => {
    return anAction.type === fetchEntityDataModelProjection.SUCCESS && anAction.id === fetchProjectionAction.id;
  };
}

/*
 * sagas
 */

export function* loadDataModelWorker() :Generator<*, *, *> {

  const entitySetNames :string[] = [
    ENTITY_SET_NAMES.FORM,
    ENTITY_SET_NAMES.PEOPLE,
    ENTITY_SET_NAMES.APPEARS_IN
  ];

  try {
    yield put(loadDataModel.request());

    // 1. get all EntitySet ids
    const fetchEntitySetIdActions :SequenceAction[] = entitySetNames.map((entitySetName :string) => {
      return fetchEntitySetId({ entitySetName });
    });

    // 1.1 dispatch fetchEntitySetId actions
    yield all(
      fetchEntitySetIdActions.map((fetchEntitySetIdAction :SequenceAction) => {
        return put(fetchEntitySetIdAction);
      })
    );

    // 1.2 collect EntitySet ids
    // TODO: error handling: what if any of these requests fail?
    const fetchEntitySetIdSuccessActions :SequenceAction[] = yield all(
      fetchEntitySetIdActions.map((fetchEntitySetIdAction :SequenceAction) => {
        return take(matchFetchEntitySetIdSuccess(fetchEntitySetIdAction));
      })
    );

    // 1.3 construct EDM projections
    const projections :Object[][] = fetchEntitySetIdSuccessActions.map((successAction :SequenceAction) => {
      return [{
        id: successAction.data.entitySetId,
        include: [
          'EntitySet',
          'EntityType',
          'PropertyTypeInEntitySet'
        ],
        type: 'EntitySet'
      }];
    });

    // 2. get all EntitySet data models
    const fetchProjectionActions :SequenceAction[] = projections.map((projection :Object[]) => {
      return fetchEntityDataModelProjection({ projection });
    });

    // 2.1 dispatch fetchEntityDataModelProjection actions
    yield all(
      fetchProjectionActions.map((fetchProjectionAction :SequenceAction) => {
        return put(fetchProjectionAction);
      })
    );

    // 2.2 collect EntitySet data models
    // TODO: error handling: what if any of these requests fail?
    const fetchProjectionSuccessActions :SequenceAction[] = yield all(
      fetchProjectionActions.map((fetchProjectionAction :SequenceAction) => {
        return take(matchFetchProjectionSuccess(fetchProjectionAction));
      })
    );

    // TODO: consider adding checks for the expected structure of the response projection objects... should have
    // "propertyTypes", "entityTypes", and "entitySets" properties, and "entitySets" should contain exactly one
    // property (the EntitySet id corresponding to that projection)
    const dataModels :Object[] = fetchProjectionSuccessActions.map((successAction :SequenceAction) => {
      return {
        ...successAction.data.edm
      };
    });

    yield put(loadDataModel.success({ dataModels }));
  }
  catch (error) {
    yield put(loadDataModel.failure({ error }));
  }
  finally {
    yield put(loadDataModel.finally());
  }
}

export function* loadDataModelWatcher() :Generator<*, *, *> {

  yield takeEvery(LOAD_DATA_MODEL, loadDataModelWorker);
}
