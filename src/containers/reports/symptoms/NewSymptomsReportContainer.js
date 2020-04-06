// @flow
import React, { useEffect, useCallback, useRef } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Button,
  Card,
  CardStack,
  Spinner,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Redirect } from 'react-router-dom';
import { RequestStates } from 'redux-reqseq';
import { clearSymptomsReport } from './SymptomsReportActions';
import LastContactWith from './LastContactWith';
import NewSymptomsReport from './NewSymptomsReport';

import ProfileBanner from '../../profile/ProfileBanner';
import SuccessSplash from '../shared/SuccessSplash';
import { usePosition } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { HOME_PATH } from '../../../core/router/Routes';

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 30px 30px 30px;
`;

const NewSymptomsReportContainer = () => {
  const location = useLocation();
  const formRef = useRef();
  const dispatch = useDispatch();
  const [position, error] = usePosition(500);
  const submitState = useSelector((store) => store.getIn(['symptomsReport', 'submitState']));
  useEffect(() => () => dispatch(clearSymptomsReport()), [dispatch]);

  const isLoading = !position.coords && !error;
  const isSubmitting = submitState === RequestStates.PENDING;
  const submitSuccess = submitState === RequestStates.SUCCESS;

  const handleExternalSubmit = useCallback(() => {
    if (formRef.current) {
      formRef.current.submit();
    }
  }, []);

  const { state: selectedPerson = Map() } = location;
  if (!Map.isMap(selectedPerson) || selectedPerson.isEmpty()) return <Redirect to={HOME_PATH} />;

  const content = submitSuccess
    ? (
      <CardStack>
        <SuccessSplash reportType="Symptoms Report" selectedPerson={selectedPerson} />
        <LastContactWith selectedPerson={selectedPerson} />
      </CardStack>
    )
    : (
      <Card>
        <NewSymptomsReport
            ref={formRef}
            position={position}
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
    );

  return (
    <ContentOuterWrapper>
      <ProfileBanner selectedPerson={selectedPerson} />
      <ContentWrapper>
        <CardStack>
          {
            isLoading
              ? <Spinner size="3x" />
              : content
          }
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default NewSymptomsReportContainer;
