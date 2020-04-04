// @flow

import React, { useEffect } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { Spinner } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import { getEntityKeyId } from '../../../utils/DataUtils';
import { clearRecentInteractions, getRecentInteractions } from '../interaction/RecentInteractionActions';
import LastContactList from './LastContactList';

const Header = styled.h1`
  font-weight: 600;
  font-size: 1.375rem;
  margin: 0 0 1.25rem 0;
`;

const Centered = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
`;

type Props = {
  selectedPerson :Map;
};

const LastContactWith = (props :Props) => {
  const dispatch = useDispatch();
  const fetchState :RequestState = useSelector((store) => store.getIn(['recentInteractions', 'fetchState']));
  const recentInteractions :List = useSelector((store) => store.getIn(['recentInteractions', 'data']));
  const { selectedPerson } = props;

  useEffect(() => {
    const personEKID = getEntityKeyId(selectedPerson);
    dispatch(getRecentInteractions(personEKID));

    return () => {
      dispatch(clearRecentInteractions());
    };
  }, [dispatch, selectedPerson]);

  const isLoading = fetchState === RequestStates.PENDING;

  return (
    <div>
      <Header>Last Contact With</Header>
      {
        isLoading
          ? (
            <Centered>
              <Spinner size="3x" />
            </Centered>
          )
          : <LastContactList recentInteractions={recentInteractions} />
      }
    </div>
  );
};

export default LastContactWith;
