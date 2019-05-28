// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import isFunction from 'lodash/isFunction';
import { Map } from 'immutable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import {
  Label,
  Card,
  CardSegment,
  Colors
} from 'lattice-ui-kit';

import { keyIn } from '../../utils/DataUtils';

const { NEUTRALS } = Colors;

const StyledCard = styled(Card)`
  :hover {
    box-shadow: rgba(0, 0, 0, 0.07) 0px 5px 15px 0px;
    cursor: pointer;

    * {
      cursor: inherit;
    }
  }
`;

const Truncated = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0px, 1fr));
  grid-gap: 20px 30px;
`;

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
  onClick :(result :Map) => void;
  resultLabels :Map;
  result :Map;
}

class ReportResult extends Component<Props> {

  transformResultToDetailsList = (result :Map) => {

    const { resultLabels } = this.props;
    const labels = result.map((value :any, key :string) => {
      let label = key;
      if (resultLabels && Map.isMap(resultLabels)) {
        label = resultLabels.get(key, key);
      }

      return Map({
        key,
        label,
        value,
      });
    });
    return labels.toList();
  }

  handleClick = () => {
    const { onClick, result } = this.props;
    if (isFunction(onClick)) {
      onClick(result);
    }
  }

  render() {

    const { result } = this.props;
    const subset = result.filter(keyIn(['lastName', 'firstName', 'middleName', 'dob']));
    const details = this.transformResultToDetailsList(subset);
    const reportType = result.get('reportType');
    const occurred = result.get('occurred');
    const reporter = result.get('reporter');

    return (
      <StyledCard onClick={this.handleClick}>
        <CardSegment vertical>
          <ReportHeader>
            <FontAwesomeIcon icon={faFileAlt} color="black" fixedWidth />
            <ReportType>
              { reportType }
            </ReportType>
            <Subheading>
              {`${occurred} · ${reporter}`}
            </Subheading>
          </ReportHeader>
          <DetailsGrid>
            { details
              && details.map((detail :Map, index :number) => (
                <div key={index.toString()}>
                  <Label subtle>
                    {detail.get('label', '')}
                  </Label>
                  <Truncated>
                    {detail.get('value', '')}
                  </Truncated>
                </div>
              ))
            }
          </DetailsGrid>
        </CardSegment>
      </StyledCard>
    );
  }
}

export default ReportResult;
