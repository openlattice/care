// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const EXPORT_CRISIS_XML :'EXPORT_CRISIS_XML' = 'EXPORT_CRISIS_XML';
const exportCrisisXML :RequestSequence = newRequestSequence(EXPORT_CRISIS_XML);

export {
  EXPORT_CRISIS_XML,
  exportCrisisXML,
};
