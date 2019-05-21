// @flow
import { Map } from 'immutable';

const reportLabels = Map({
  reportType: 'Report Type',
  badge: 'Badge',
  submitter: 'Submitter'
});

const reportSearchFields = [
  {
    id: 'dateStart',
    label: 'Date Range Start',
    type: 'date'
  },
  {
    id: 'dateEnd',
    label: 'Date Range End',
    type: 'date'
  }
];

export {
  reportLabels,
  reportSearchFields,
};
