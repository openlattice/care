// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const EXPORT_CRISIS_XML :'EXPORT_CRISIS_XML' = 'EXPORT_CRISIS_XML';
const exportCrisisXML :RequestSequence = newRequestSequence(EXPORT_CRISIS_XML);

const EXPORT_CRISIS_XML_BY_DATE_RANGE :'EXPORT_CRISIS_XML_BY_DATE_RANGE' = 'EXPORT_CRISIS_XML_BY_DATE_RANGE';
const exportCrisisXMLByDateRange :RequestSequence = newRequestSequence(EXPORT_CRISIS_XML_BY_DATE_RANGE);

const RESET_EXPORT_CRISIS_XML :'RESET_EXPORT_CRISIS_XML' = 'RESET_EXPORT_CRISIS_XML';
const resetExportCrisisXML = () => ({
  type: RESET_EXPORT_CRISIS_XML
});

const GET_ADJACENT_CRISIS_DATA :'GET_ADJACENT_CRISIS_DATA' = 'GET_ADJACENT_CRISIS_DATA';
const getAdjacentCrisisData :RequestSequence = newRequestSequence(GET_ADJACENT_CRISIS_DATA);

export {
  EXPORT_CRISIS_XML,
  EXPORT_CRISIS_XML_BY_DATE_RANGE,
  GET_ADJACENT_CRISIS_DATA,
  RESET_EXPORT_CRISIS_XML,
  exportCrisisXML,
  exportCrisisXMLByDateRange,
  getAdjacentCrisisData,
  resetExportCrisisXML,
};
