// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import isFunction from 'lodash/isFunction';
import { Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import {
  Card,
  CardSegment,
  DataGrid,
} from 'lattice-ui-kit';

import { TYPE_FQN } from '../../edm/DataModelFqns';

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

type Props = {
  onClick ? :(result :Map) => void;
  resultLabels ? :Map;
  result :Map;
}

class ReportResult extends Component<Props> {

  static defaultProps = {
    onClick: undefined,
    resultLabels: Map(),
  }

  handleClick = () => {
    const { onClick, result } = this.props;
    if (isFunction(onClick)) {
      onClick(result);
    }
  }

  render() {

    const { result, resultLabels } = this.props;

    const reportType = result.get(TYPE_FQN, '');

    return (
      <Card onClick={this.handleClick}>
        <CardSegment vertical>
          <ReportHeader>
            <FontAwesomeIcon icon={faFileAlt} color="black" fixedWidth />
            <ReportType>
              { reportType }
            </ReportType>
          </ReportHeader>
          <DataGrid
              columns={2}
              data={result}
              labelMap={resultLabels} />
        </CardSegment>
      </Card>
    );
  }
}

export default ReportResult;
