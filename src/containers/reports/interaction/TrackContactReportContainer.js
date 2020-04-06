// @flow
import React, { useCallback, useEffect, useRef } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Button, Card, CardStack } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Redirect } from 'react-router-dom';
import { RequestStates } from 'redux-reqseq';

import TrackContactReport from './TrackContactReport';
import { clearRecentInteractions } from './RecentInteractionActions';

import ProfileBanner from '../../profile/ProfileBanner';
import SuccessSplash from '../shared/SuccessSplash';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { HOME_PATH } from '../../../core/router/Routes';

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 30px 30px 30px;
`;

const TrackContactReportContainer = () => {
  const location = useLocation();
  const formRef = useRef();
  const dispatch = useDispatch();
  const submitState = useSelector((store) => store.getIn(['recentInteractions', 'submitState']));
  useEffect(() => () => dispatch(clearRecentInteractions()), [dispatch]);

  const isSubmitting = submitState === RequestStates.PENDING;
  const submitSuccess = submitState === RequestStates.SUCCESS;

  const handleExternalSubmit = useCallback(() => {
    if (formRef.current) {
      formRef.current.submit();
    }
  }, []);

  const { state: selectedPerson = Map() } = location;
  if (!Map.isMap(selectedPerson) || selectedPerson.isEmpty()) return <Redirect to={HOME_PATH} />;

  return (
    <ContentOuterWrapper>
      <ProfileBanner selectedPerson={selectedPerson} />
      <ContentWrapper>
        <CardStack>
          {
            submitSuccess
              ? (
                <CardStack>
                  <SuccessSplash reportType="Contact Report" selectedPerson={selectedPerson} />
                </CardStack>
              )
              : (
                <Card>
                  <TrackContactReport
                      ref={formRef}
                      selectedPerson={selectedPerson} />
                  <ActionRow>
                    <Button
                        fullWidth
                        isLoading={isSubmitting}
                        mode="primary"
                        onClick={handleExternalSubmit}>
                      Submit
                    </Button>
                  </ActionRow>
                </Card>
              )
          }
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default TrackContactReportContainer;
