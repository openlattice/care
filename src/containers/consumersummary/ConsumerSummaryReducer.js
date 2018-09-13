/*
 * @flow
 */

 import { Map, List, fromJS } from 'immutable';

 import { getBHRReports } from './ConsumerSummaryActionFactory';

 export const REQUEST_STATUSES = {
   PRE_REQUEST: 0,
   IS_REQUESTING: 1,
   REQUEST_SUCCESS: 2,
   REQUEST_FAILURE: 3
 };

 const INITIAL_STATE :Map<*, *> = fromJS({
   submissionState: REQUEST_STATUSES.PRE_REQUEST,
   reports: List()
 });

 export default function consumerSummaryReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

   switch (action.type) {

     case getBHRReports.case(action.type): {

       return getBHRReports.reducer(state, action, {
         REQUEST: () => {
           return state.set('submissionState', REQUEST_STATUSES.IS_REQUESTING);
         },
         SUCCESS: () => {
           return state
              .set('submissionState', REQUEST_STATUSES.REQUEST_SUCCESS)
              .set('reports', fromJS(action.value))
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
