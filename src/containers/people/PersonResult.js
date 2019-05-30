// @flow

import React, { Component } from 'react';
import isFunction from 'lodash/isFunction';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPortrait } from '@fortawesome/pro-solid-svg-icons';
import { Map } from 'immutable';

import { Card, Label, Colors } from 'lattice-ui-kit';

const { NEUTRALS } = Colors;

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

  handleClick = () => {
    const { result, onClick } = this.props;
    if (isFunction(onClick)) {
      onClick(result);
    }
  }

  render() {
    const { result } = this.props;
    const details = this.transformResultToDetailsList(result);

    return (
      <Card onClick={this.handleClick}>
        <ResultWrapper>
          <FontAwesomeIcon icon={faPortrait} size="8x" color={NEUTRALS[5]} />
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
