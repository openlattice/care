// @flow
import React from 'react';

import styled from 'styled-components';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Constants } from 'lattice';
import {
  Card,
  CardSegment,
  Colors,
  DataGrid,
} from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';

import { CRISIS_REPORT, CRISIS_REPORT_CLINICIAN, FOLLOW_UP_REPORT } from './crisis/schemas/constants';

import { useAppSettings } from '../../components/hooks';
import {
  CRISIS_REPORT_CLINICIAN_PATH,
  CRISIS_REPORT_PATH,
  FOLLOW_UP_REPORT_PATH,
  REPORT_ID_PATH,
  REPORT_VIEW_PATH
} from '../../core/router/Routes';
import { goToPath } from '../../core/router/RoutingActions';

const { NEUTRALS } = Colors;
const { OPENLATTICE_ID_FQN } = Constants;
const ReportHeader = styled.div`
  display: flex;
  flex: 1;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 10px 0;
  align-items: center;
`;

const ReportType = styled.span`
  font-size: 14px;
  font-weight: 600;
  margin: 0 15px;
`;

const Subheading = styled.span`
  color: ${NEUTRALS[1]};
  font-size: 14px;
  font-weight: 600;
  margin: 0 5px;
`;

type Props = {
  resultLabels ? :Map;
  result :Map;
}

const ReportResult = (props :Props) => {
  const dispatch = useDispatch();
  const { result, resultLabels } = props;
  const settings = useAppSettings();

  const reportType = result.get('reportType', '');
  const occurred = result.get('occurred', '');
  const reporter = result.get('reporter', '');

  const handleClick = () => {
    const reportEKID = result.get(OPENLATTICE_ID_FQN);
    if (settings.get('v1') || settings.get('v2')) {
      if (reportType === CRISIS_REPORT_CLINICIAN) {
        dispatch(goToPath(CRISIS_REPORT_CLINICIAN_PATH.replace(REPORT_ID_PATH, reportEKID)));
      }
      if (reportType === CRISIS_REPORT) {
        dispatch(goToPath(CRISIS_REPORT_PATH.replace(REPORT_ID_PATH, reportEKID)));
      }
      if (reportType === FOLLOW_UP_REPORT) {
        dispatch(goToPath(FOLLOW_UP_REPORT_PATH.replace(REPORT_ID_PATH, reportEKID)));
      }
    }
    else {
      dispatch(goToPath(REPORT_VIEW_PATH.replace(REPORT_ID_PATH, reportEKID)));
    }
  };

  return (
    <Card onClick={handleClick}>
      <CardSegment vertical>
        <ReportHeader>
          <FontAwesomeIcon icon={faFileAlt} fixedWidth />
          <ReportType>
            { reportType }
          </ReportType>
          <Subheading>
            {`${occurred} · ${reporter}`}
          </Subheading>
        </ReportHeader>
        <DataGrid
            columns={4}
            data={result}
            labelMap={resultLabels} />
      </CardSegment>
    </Card>
  );
};

ReportResult.defaultProps = {
  resultLabels: Map(),
};

export default ReportResult;
