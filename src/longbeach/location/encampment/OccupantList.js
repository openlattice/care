// @flow
import React from 'react';

import styled from 'styled-components';
import { faUserSlash } from '@fortawesome/pro-solid-svg-icons';
import {
  Card,
  CardSegment,
  IconSplash,
  MinusButton,
  Spinner,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import { removePersonFromEncampment } from './EncampmentActions';
import { ENCAMPMENT_STORE_PATH } from './constants';

import { getFirstLastFromPerson } from '../../../utils/PersonUtils';

const StyledSegment = styled(CardSegment)`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 auto;
`;

const OccupantList = () => {
  const dispatch = useDispatch();
  const livesAt = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'occupation', 'livesAt']));
  const people = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'occupation', 'people']));
  const fetchState = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'occupation', 'fetchState']));

  const isLoading = fetchState === RequestStates.PENDING;

  if (isLoading) {
    return (
      <Card>
        <CardSegment vertical>
          <Spinner size="3x" />
        </CardSegment>
      </Card>
    );
  }

  if (!livesAt.count()) {
    return <IconSplash icon={faUserSlash} caption="No documented occupants." />;
  }

  return (
    <Card>
      {
        livesAt.toJS().map((edge) => {
          const person = people.get(edge);
          const name = getFirstLastFromPerson(person);

          const deleteEdge = () => dispatch(removePersonFromEncampment(edge));
          return (
            <StyledSegment key={edge} padding="10px" onClick={}>
              <span>{name}</span>
              <MinusButton size="sm" mode="negative" onClick={deleteEdge} />
            </StyledSegment>
          );
        })
      }
    </Card>
  );

};

export default OccupantList;
