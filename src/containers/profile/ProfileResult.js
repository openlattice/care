// @flow
import React from 'react';

import styled from 'styled-components';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  Card,
  CardSegment,
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { useDispatch } from 'react-redux';

import { useAppSettings } from '../../components/hooks';
import {
  CRISIS_REPORT_CLINICIAN_PATH,
  CRISIS_REPORT_PATH,
  REPORT_ID_PATH,
  REPORT_VIEW_PATH
} from '../../core/router/Routes';
import { goToPath } from '../../core/router/RoutingActions';
import { DATETIME_START_FQN, DATE_TIME_OCCURRED_FQN, TYPE_FQN } from '../../edm/DataModelFqns';
import { getEntityKeyId } from '../../utils/DataUtils';
import { CRISIS_REPORT, CRISIS_REPORT_CLINICIAN } from '../reports/crisis/schemas/constants';

const ReportHeader = styled.div`
  display: flex;
  flex: 1;
  font-size: 20px;
  font-weight: 600;
  align-items: center;
`;

const ReportType = styled.span`
  font-size: 14px;
  font-weight: 600;
  margin: 0 15px;
`;

type Props = {
  result :Map;
}

const ProfileResult = (props :Props) => {
  const dispatch = useDispatch();
  const settings = useAppSettings();

  const { result } = props;
  const reportType = result.getIn([TYPE_FQN, 0], '');
  const rawDatetime :string = result.getIn([DATE_TIME_OCCURRED_FQN, 0]) || result.getIn([DATETIME_START_FQN, 0]);
  const formattedDate = DateTime.fromISO(rawDatetime).toLocaleString(DateTime.DATE_SHORT);

  const handleClick = () => {
    const reportEKID = getEntityKeyId(result);
    if (settings.get('v1') || settings.get('v2')) {
      if (reportType === CRISIS_REPORT_CLINICIAN) {
        dispatch(goToPath(CRISIS_REPORT_CLINICIAN_PATH.replace(REPORT_ID_PATH, reportEKID)));
      }
      if (reportType === CRISIS_REPORT) {
        dispatch(goToPath(CRISIS_REPORT_PATH.replace(REPORT_ID_PATH, reportEKID)));
      }
    }
    else {
      dispatch(goToPath(REPORT_VIEW_PATH.replace(REPORT_ID_PATH, reportEKID)));
    }
  };


  return (
    <Card onClick={handleClick}>
      <CardSegment>
        <ReportHeader>
          <FontAwesomeIcon icon={faFileAlt} color="black" fixedWidth />
          <ReportType>
            { reportType }
          </ReportType>
        </ReportHeader>
        {formattedDate}
      </CardSegment>
    </Card>
  );
};

export default ProfileResult;
