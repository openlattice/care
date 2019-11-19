// @flow
import {
  DATE_TIME_FQN,
  PRIORITY_FQN,
  STATUS_FQN,
  TITLE_FQN,
} from '../../edm/DataModelFqns';

const cellStyle = {
  width: '105px'
};

const ISSUE_HEADERS = [
  {
    key: TITLE_FQN,
    label: 'Subject',
    cellStyle: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
  },
  { key: PRIORITY_FQN, label: 'Priority', cellStyle },
  { key: STATUS_FQN, label: 'Status', cellStyle },
  { key: DATE_TIME_FQN, label: 'Created', cellStyle },
  {
    key: 'action',
    label: '',
    cellStyle: { width: '50px' },
    sortable: false
  },
];


const ISSUE_FILTERS :Object = {
  MY_OPEN_ISSUES: 'My Open Issues',
  REPORTED_BY_ME: 'Reported By Me',
  ALL_ISSUES: 'All Issues',
};

const STATUS = {
  OPEN: 'Open',
  COMPLETED: 'Completed',
  DECLINED: 'Declined',
};

export {
  ISSUE_HEADERS,
  ISSUE_FILTERS,
  STATUS,
};
