// @flow
import React, { useEffect, useMemo } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Form, Paged } from 'lattice-fabricate';
import {
  Button,
  Card,
  Spinner
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import { clearCrisisReport, submitCrisisReport } from './CrisisActions';
import { v1 } from './schemas';
import { CRISIS_REPORT } from './schemas/constants';

import SuccessSplash from '../shared/SuccessSplash';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { generateReviewSchema } from '../../../utils/SchemaUtils';
import { getFormSchema } from '../FormSchemasActions';

const { CRISIS_REPORT_FQN } = APP_TYPES_FQNS;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px 30px 30px;
`;

type Props = {
  pageRef :{ current :HTMLDivElement | null };
  selectedPerson :Map;
};

const NewCrisisReport = ({ pageRef, selectedPerson } :Props) => {
  const dispatch = useDispatch();
  const submitState = useSelector((store) => store.getIn(['crisisReport', 'submitState']));
  const remoteSchemas = useSelector((store) => store.getIn(['formSchemas', 'schemas', 'CRISIS_REPORT']));
  const fetchState = useSelector((store) => store.getIn(['formSchemas', 'fetchState']));

  const allSchemas = useMemo(
    () => {
      let schemaVersion = v1;
      if (remoteSchemas) {
        schemaVersion = remoteSchemas.toJS();
      }
      const { schemas, uiSchemas } = schemaVersion;
      return {
        reviewSchemas: generateReviewSchema(schemas, uiSchemas, true),
        schemas,
        uiSchemas,
      };
    },
    [remoteSchemas]
  );

  const getVersionSubmit = (formData :Object) => () => dispatch(submitCrisisReport({
    formData,
    reportFQN: CRISIS_REPORT_FQN,
    selectedPerson,
  }));

  useEffect(() => {
    dispatch(getFormSchema('CRISIS_REPORT'));

    return () => dispatch(clearCrisisReport());
  }, [dispatch]);

  const isLoading = submitState === RequestStates.PENDING;

  if (fetchState === RequestStates.PENDING) {
    return <Spinner size="3x" />;
  }

  if (submitState === RequestStates.SUCCESS) {
    return (
      <SuccessSplash reportType={CRISIS_REPORT} selectedPerson={selectedPerson} />
    );
  }

  const { reviewSchemas, schemas, uiSchemas } = allSchemas;

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
              ? getVersionSubmit(pagedData)
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
                      color="primary"
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
