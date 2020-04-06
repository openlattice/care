// @flow
import React, { useEffect } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Form, Paged } from 'lattice-fabricate';
import {
  Button,
  Card,
  CardStack,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import { clearSymptomsReport, submitSymptomsReport } from './SymptomsReportActions';
import { schemas, uiSchemas } from './schemas';

import SuccessSplash from '../shared/SuccessSplash';
import LastContactWith from './LastContactWith';

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 30px 30px 30px;
`;

type Props = {
  pageRef :{ current :HTMLDivElement | null };
  position :Position;
  selectedPerson :Map;
};

const NewCrisisReport = ({ position, selectedPerson } :Props) => {
  const dispatch = useDispatch();
  const submitState = useSelector((store) => store.getIn(['symptomsReport', 'submitState']));

  useEffect(() => () => dispatch(clearSymptomsReport()), [dispatch]);

  const isLoading = submitState === RequestStates.PENDING;

  if (submitState === RequestStates.SUCCESS) {
    return (
      <CardStack>
        <SuccessSplash reportType="Symptoms Report" selectedPerson={selectedPerson} />
        <LastContactWith selectedPerson={selectedPerson} />
      </CardStack>
    );
  }

  return (
    <Card>
      <Paged
          render={({
            formRef,
            page,
            validateAndSubmit,
          }) => {

            const handleSubmit = (payload) => {
              dispatch(submitSymptomsReport({
                formData: payload.formData,
                selectedPerson,
                position
              }));
            };

            return (
              <>
                <Form
                    hideSubmit
                    onSubmit={handleSubmit}
                    ref={formRef}
                    schema={schemas[page]}
                    uiSchema={uiSchemas[page]} />
                <ActionRow>
                  <Button
                      fullWidth
                      isLoading={isLoading}
                      mode="primary"
                      onClick={validateAndSubmit}>
                    Submit
                  </Button>
                </ActionRow>
              </>
            );
          }} />
    </Card>
  );
};

export default NewCrisisReport;
