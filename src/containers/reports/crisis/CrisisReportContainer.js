// @flow
import React, { useEffect } from 'react';

import { Map } from 'immutable';
import { Form } from 'lattice-fabricate';
import {
  Breadcrumbs,
  Card,
  CardStack,
  Spinner,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { RequestStates } from 'redux-reqseq';

import {
  addOptionalCrisisReportContent,
  deleteCrisisReportContent,
  getCrisisReport,
  updateCrisisReport
} from './CrisisActions';
import { schemas, uiSchemas } from './schemas';
import { generateReviewSchema } from './schemas/schemaUtils';

import BlameCard from '../shared/BlameCard';
import { BreadcrumbItem, BreadcrumbLink } from '../../../components/breadcrumbs';
import { useAuthorization } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { REPORT_ID_PARAM } from '../../../core/router/Routes';
import { getAuthorization } from '../../../core/sagas/authorize/AuthorizeActions';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { getFirstLastFromPerson } from '../../../utils/PersonUtils';

const {
  CLINICIAN_REPORT_FQN
} = APP_TYPES_FQNS;

const CrisisReportContainer = () => {
  const [isAuthorized] = useAuthorization('profile', getAuthorization);

  // TODO memoize this so you can reuse it in the saga
  const reviewSchemas = generateReviewSchema(schemas, uiSchemas, !isAuthorized);

  const entityIndexToIdMap = useSelector((store) => store.getIn(['crisisReport', 'entityIndexToIdMap']));
  const entitySetIds = useSelector((store) => store.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
  const formData = useSelector((store) => store.getIn(['crisisReport', 'formData']));
  const fetchState = useSelector((store) => store.getIn(['crisisReport', 'fetchState']));
  const propertyTypeIds = useSelector((store) => store.getIn(['edm', 'fqnToIdMap'], Map()));
  const reporterData = useSelector((store) => store.getIn(['crisisReport', 'reporterData']));
  const subjectData = useSelector((store) => store.getIn(['crisisReport', 'subjectData']));

  const dispatch = useDispatch();
  const match = useRouteMatch();

  const { [REPORT_ID_PARAM]: reportId } = match.params;

  useEffect(() => {
    dispatch(getCrisisReport({
      reportEKID: reportId,
      reportFQN: CLINICIAN_REPORT_FQN,
      // schema: reviewSchemas.schema
    }));
  }, [dispatch, reportId]);

  if (fetchState === RequestStates.PENDING) {
    return <Spinner size="3x" />;
  }

  const handleUpdateCrisisReport = (params) => {
    dispatch(updateCrisisReport(params));
  };

  const handleDeleteCrisisReportContent = (params) => {
    dispatch(deleteCrisisReportContent(params));
  };

  const handleAddOptionalContent = (params) => {
    const existingEKIDs = {
      [CLINICIAN_REPORT_FQN]: reportId,
    };

    dispatch(addOptionalCrisisReportContent({
      ...params,
      existingEKIDs
    }));
  };

  const name = getFirstLastFromPerson(subjectData);
  const formContext = {
    addActions: {
      addOptional: handleAddOptionalContent
    },
    deleteAction: handleDeleteCrisisReportContent,
    editAction: handleUpdateCrisisReport,
    entityIndexToIdMap,
    entitySetIds,
    propertyTypeIds,
  };

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <CardStack>
          <Breadcrumbs>
            <BreadcrumbLink>{name}</BreadcrumbLink>
            <BreadcrumbItem>Crisis Report</BreadcrumbItem>
          </Breadcrumbs>
          <BlameCard reporterData={reporterData} />
          <Card>
            <Form
                disabled
                formContext={formContext}
                formData={formData.toJS()}
                schema={reviewSchemas.schema}
                uiSchema={reviewSchemas.uiSchema} />
          </Card>
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default CrisisReportContainer;
