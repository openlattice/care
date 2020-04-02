// @flow
import React, { useEffect, useMemo } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Form, Paged } from 'lattice-fabricate';
import {
  Button,
  Card,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import { clearCrisisReport, submitCrisisReport } from './CrisisActions';
import { v1 } from './schemas';

import SuccessSplash from '../shared/SuccessSplash';
import { generateReviewSchema } from '../../../utils/SchemaUtils';

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px 30px 30px;
`;

const { schemas, uiSchemas } = v1;

type Props = {
  pageRef :{ current :HTMLDivElement | null };
  selectedPerson :Map;
};

const NewCrisisReport = ({ pageRef, selectedPerson } :Props) => {
  const dispatch = useDispatch();
  const reviewSchemas = useMemo(() => generateReviewSchema(schemas, uiSchemas, true), []);
  const submitState = useSelector((store) => store.getIn(['crisisReport', 'submitState']));

  useEffect(() => () => dispatch(clearCrisisReport()), [dispatch]);

  const isLoading = submitState === RequestStates.PENDING;

  if (submitState === RequestStates.SUCCESS) {
    return (
      <SuccessSplash reportType="Crisis Report" selectedPerson={selectedPerson} />
    );
  }

  return (
    <Card>
      <Paged
          render={({
            formRef,
            pagedData,
            page,
            onBack,
            onNext,
            validateAndSubmit,
          }) => {
            const totalPages = schemas.length + 1;
            const isReviewPage = page === totalPages - 1;

            const validate = isReviewPage
              ? () => {
                dispatch(submitCrisisReport({ formData: pagedData, selectedPerson }));
              }
              : validateAndSubmit;

            const scrollToContentTop = () => {
              if (pageRef.current) {
                pageRef.current.scrollIntoView({
                  behavior: 'smooth'
                });
              }
            };

            const handleNext = () => {
              scrollToContentTop();
              onNext();
            };

            const handleBack = () => {
              scrollToContentTop();
              onBack();
            };

            return (
              <>
                <Form
                    disabled={isReviewPage}
                    formData={pagedData}
                    hideSubmit
                    onSubmit={handleNext}
                    ref={formRef}
                    schema={isReviewPage ? reviewSchemas.schema : schemas[page]}
                    uiSchema={isReviewPage ? reviewSchemas.uiSchema : uiSchemas[page]} />
                <ActionRow>
                  <Button
                      disabled={!(page > 0)}
                      onClick={handleBack}>
                    Back
                  </Button>
                  <span>{`${page + 1} of ${totalPages}`}</span>
                  <Button
                      isLoading={isLoading}
                      mode="primary"
                      onClick={validate}>
                    { isReviewPage ? 'Submit' : 'Next' }
                  </Button>
                </ActionRow>
              </>
            );
          }} />
    </Card>
  );

};

export default NewCrisisReport;
