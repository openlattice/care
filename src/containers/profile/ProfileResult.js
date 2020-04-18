// @flow
import React, { Component } from 'react';

import isFunction from 'lodash/isFunction';
import styled from 'styled-components';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Card,
  CardSegment,
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';

import { DATE_TIME_OCCURRED_FQN, TYPE_FQN } from '../../edm/DataModelFqns';

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

    const { result } = this.props;

    const reportType = result.get(TYPE_FQN, '');
    const rawDatetime :string = result.getIn([DATE_TIME_OCCURRED_FQN, 0]);
    const formattedDate = DateTime.fromISO(rawDatetime).toLocaleString(DateTime.DATE_SHORT);

    return (
      <Card onClick={this.handleClick}>
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
  }
}

export default ReportResult;
