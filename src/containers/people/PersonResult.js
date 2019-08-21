// @flow

import React, { Component } from 'react';
import isFunction from 'lodash/isFunction';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { Map } from 'immutable';
import { Card, Label } from 'lattice-ui-kit';
import { PERSON_DOB_FQN, PERSON_FIRST_NAME_FQN } from '../../edm/DataModelFqns';
import Portrait from '../../components/portrait/Portrait';

const DetailsGrid = styled.div`
  display: grid;
  grid-gap: 20px 30px;
  grid-template-columns: repeat(3, minmax(0, 2fr)) 1fr;
  padding: 10px 20px;
  flex: 1;

  > div:last-child {
    grid-column: 3 / -1;
  }
`;

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

const Truncated = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type Props = {
  result :Map;
  resultLabels ? :Map;
  onClick ? :(result :Map) => void;
}

class PersonResult extends Component<Props> {

  static defaultProps = {
    onClick: undefined,
    resultLabels: Map(),
  }

  transformResultToDetailsList = (result :Map) => {
    const { resultLabels } = this.props;

    let details;
    if (resultLabels && Map.isMap(resultLabels)) {
      details = resultLabels.map((label :string, key :string) => Map({
        label,
        value: result.get(key, ''),
        key
      }));
    }
    else {
      details = result.map((value :any, key :string) => Map({
        label: key,
        value,
        key
      }));
    }

    return details.toList();
  }

  formatResult = (result :Map) => {
    const rawDatetime :string = result.getIn([PERSON_DOB_FQN, 0]);
    if (rawDatetime) {
      const formattedDob = DateTime.fromISO(rawDatetime).toLocaleString(DateTime.DATE_SHORT);
      return result.setIn([PERSON_DOB_FQN, 0], formattedDob);
    }

    return result;
  }

  handleClick = () => {
    const { result, onClick } = this.props;
    if (isFunction(onClick)) {
      onClick(result);
    }
  }

  render() {
    const { result } = this.props;
    const formattedResult = this.formatResult(result);
    const details = this.transformResultToDetailsList(formattedResult);

    // REMOVE ME
    const givenName = result.getIn([PERSON_FIRST_NAME_FQN, 0]);
    const isMalfoy = givenName === 'Scorpius';

    return (
      <Card onClick={this.handleClick}>
        <ResultWrapper>
          <Portrait isMalfoy={isMalfoy} height="128" width="96" />
          {/* <FontAwesomeIcon icon={faPortrait} size="8x" color={NEUTRALS[5]} /> */}
          <DetailsGrid>
            { details
              && details.map((detail :Map) => (
                <div key={detail.get('key')}>
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
        </ResultWrapper>
      </Card>
    );
  }
}

export default PersonResult;
export type { Props as ResultProps };
