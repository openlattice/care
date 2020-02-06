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

import { REPORT_ID_PATH, REPORT_VIEW_PATH } from '../../core/router/Routes';
import { goToPath } from '../../core/router/RoutingActions';

const { OPENLATTICE_ID_FQN } = Constants;

const { NEUTRALS } = Colors;

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


  const handleResultClick = () => {
    const reportEKID = result.get(OPENLATTICE_ID_FQN);
    dispatch(goToPath(REPORT_VIEW_PATH.replace(REPORT_ID_PATH, reportEKID)));
  };

  const reportType = result.get('reportType', '');
  const occurred = result.get('occurred', '');
  const reporter = result.get('reporter', '');

  return (
    <Card onClick={handleResultClick}>
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
}

ReportResult.defaultProps = {
  resultLabels: Map(),
};

export default ReportResult;
