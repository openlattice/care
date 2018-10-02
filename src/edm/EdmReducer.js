/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';
import { Models } from 'lattice';
import { EntityDataModelApiActions } from 'lattice-sagas';

const { getAllPropertyTypes } = EntityDataModelApiActions;
// TODO: use PropertyType and PropertyTypeBuilder models
const { FullyQualifiedName } = Models;

const INITIAL_STATE :Map<*, *> = fromJS({
  fqnToIdMap: Map(),
  isFetchingAllPropertyTypes: false,
  propertyTypesById: Map(),
});

export default function edmReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case getAllPropertyTypes.case(action.type): {
      return getAllPropertyTypes.reducer(state, action, {
        REQUEST: () => {
          return state.set('isFetchingAllPropertyTypes', true);
        },
        SUCCESS: () => {
          const seqAction :SequenceAction = (action :any);
          const propertyTypes :List<Map<*, *>> = fromJS(seqAction.value);
          const propertyTypesById :Map<string, number> = Map().asMutable();
          const fqnToIdMap :Map<FullyQualifiedName, string> = Map().asMutable();
          propertyTypes.forEach((propertyType :Map<*, *>) => {
            propertyTypesById.set(propertyType.get('id'), propertyType);
            fqnToIdMap.set(new FullyQualifiedName(propertyType.get('type')), propertyType.get('id'));
          });
          return state
            .set('fqnToIdMap', fqnToIdMap.asImmutable())
            .set('propertyTypesById', propertyTypesById.asImmutable());
        },
        FAILURE: () => {
          return state
            .set('fqnToIdMap', Map())
            .set('propertyTypesById', Map());
        },
        FINALLY: () => {
          return state.set('isFetchingAllPropertyTypes', false);
        }
      });
    }

    default:
      return state;
  }
}
