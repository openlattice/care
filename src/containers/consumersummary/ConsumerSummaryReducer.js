/*
 * @flow
 */

 import { Map, fromJS } from 'immutable';

 import { getBHRReport } from './ConsumerSummaryActionFactory';

 export const REQUEST_STATUSES = {
   PRE_REQUEST: 0,
   IS_REQUESTING: 1,
   REQUEST_SUCCESS: 2,
   REQUEST_FAILURE: 3
 };

 const INITIAL_STATE :Map<*, *> = fromJS({
   submissionState: REQUEST_STATUSES.PRE_REQUEST
 });

 export default function consumerSummaryReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

   switch (action.type) {

     case getBHRReport.case(action.type): {

       return getBHRReport.reducer(state, action, {
         REQUEST: () => {
           return state.set('submissionState', REQUEST_STATUSES.IS_REQUESTING);
         },
         SUCCESS: () => {
           return state
              .set('submissionState', REQUEST_STATUSES.REQUEST_SUCCESS)
              .set('formData', fromJS(action.value[0]))
         },
         FAILURE: () => {
           return state.set('submissionState', REQUEST_STATUSES.REQUEST_FAILURE);
         }
       });
     }

     default:
       return state;
   }
 }
