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

function matchFetchEntitySetIdResponse(fetchEntitySetIdAction :SequenceAction) {
  return (anAction :Object) => {
    return (anAction.type === fetchEntitySetId.SUCCESS && anAction.id === fetchEntitySetIdAction.id)
      || (anAction.type === fetchEntitySetId.FAILURE && anAction.id === fetchEntitySetIdAction.id);
  };
}

function matchFetchProjectionResponse(fetchProjectionAction :SequenceAction) {
  return (anAction :Object) => {
    return (anAction.type === fetchEntityDataModelProjection.SUCCESS && anAction.id === fetchProjectionAction.id)
      || (anAction.type === fetchEntityDataModelProjection.FAILURE && anAction.id === fetchProjectionAction.id);
  };
}

/*
 * sagas
 */

export function* loadDataModelWorker() :Generator<*, *, *> {

  try {

    yield put(loadDataModel.request());

    let anyErrors :boolean = false;
    const entitySetNames :string[] = [
      ENTITY_SET_NAMES.FORM,
      ENTITY_SET_NAMES.PEOPLE,
      ENTITY_SET_NAMES.APPEARS_IN
    ];

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
    const fetchEntitySetIdResponseActions :SequenceAction[] = yield all(
      fetchEntitySetIdActions.map((fetchEntitySetIdAction :SequenceAction) => {
        return take(matchFetchEntitySetIdResponse(fetchEntitySetIdAction));
      })
    );

    // 1.3 construct EDM projections
    const projections :Object[][] = fetchEntitySetIdResponseActions.map((responseAction :SequenceAction) => {
      // !!! HACK !!! - quick fix
      if (responseAction.data.error !== null && responseAction.data.error !== undefined) {
        anyErrors = true;
        return [];
      }
      return [{
        id: responseAction.data.entitySetId,
        include: [
          'EntitySet',
          'EntityType',
          'PropertyTypeInEntitySet'
        ],
        type: 'EntitySet'
      }];
    });

    // !!! HACK !!! - quick fix
    if (anyErrors) {
      throw new Error();
    }

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
    const fetchProjectionResponseActions :SequenceAction[] = yield all(
      fetchProjectionActions.map((fetchProjectionAction :SequenceAction) => {
        return take(matchFetchProjectionResponse(fetchProjectionAction));
      })
    );

    // TODO: consider adding checks for the expected structure of the response projection objects... should have
    // "propertyTypes", "entityTypes", and "entitySets" properties, and "entitySets" should contain exactly one
    // property (the EntitySet id corresponding to that projection)
    const dataModels :Object[] = fetchProjectionResponseActions.map((responseAction :SequenceAction) => {
      // !!! HACK !!! - quick fix
      if (responseAction.data.error !== null && responseAction.data.error !== undefined) {
        anyErrors = true;
        return {};
      }
      return {
        ...responseAction.data.edm
      };
    });

    if (anyErrors) {
      throw new Error();
    }

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
