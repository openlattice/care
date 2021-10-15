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

import { clearCrisisReport, submitCrisisReportV2 } from './CrisisActions';
import { v2 } from './schemas';
import { CRISIS_REPORT, CRISIS_REPORT_TYPE } from './schemas/constants';

import SuccessSplash from '../shared/SuccessSplash';
import { selectFormSchemas } from '../../../core/redux/selectors';
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
  incident :Map;
  pageRef :{ current :HTMLDivElement | null };
  selectedPerson :Map;
};

const NewCrisisReportV2 = ({ incident, pageRef, selectedPerson } :Props) => {
  const dispatch = useDispatch();
  const submitState = useSelector((store) => store.getIn(['crisisReport', 'submitState']));
  const remoteSchemas = useSelector(selectFormSchemas(CRISIS_REPORT_TYPE));

  useEffect(() => {
    dispatch(getFormSchema(CRISIS_REPORT_TYPE));
  }, [dispatch]);

  useEffect(() => () => dispatch(clearCrisisReport()), [dispatch]);

  const { schemas, uiSchemas, reviewSchemas } = useMemo(
    () => {
      let schemaVersion = v2.officer;
      if (remoteSchemas) {
        schemaVersion = remoteSchemas.toJS();
      }
      if (!incident.isEmpty()) {
        schemaVersion.schemas = schemaVersion.schemas.slice(1);
        schemaVersion.uiSchemas = schemaVersion.uiSchemas.slice(1);
      }
      return {
        reviewSchemas: generateReviewSchema(schemaVersion.schemas, schemaVersion.uiSchemas, true),
        schemas: schemaVersion.schemas,
        uiSchemas: schemaVersion.uiSchemas,
      };
    },
    [remoteSchemas, incident]
  );

  const getVersionSubmit = (formData :Object) => () => dispatch(submitCrisisReportV2({
    formData,
    incident,
    reportFQN: CRISIS_REPORT_FQN,
    selectedPerson,
  }));

  const isLoading = submitState === RequestStates.PENDING;

  if (submitState === RequestStates.SUCCESS) {
    return (
      <SuccessSplash reportType={CRISIS_REPORT} selectedPerson={selectedPerson} />
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

export default NewCrisisReportV2;
