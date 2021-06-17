// @flow
import React, { useCallback, useEffect, useMemo } from 'react';

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
  clearCrisisReport,
  deleteCrisisReport,
  deleteCrisisReportContent,
  getCrisisReportV2,
  updateCrisisReport,
} from './CrisisActions';
import { v2 } from './schemas';

import BlameCard from '../shared/BlameCard';
import * as FQN from '../../../edm/DataModelFqns';
import { BreadcrumbItem, BreadcrumbLink } from '../../../components/breadcrumbs';
import { useAppSettings, useAuthorization } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import {
  CRISIS_REPORT_PATH,
  PROFILE_ID_PATH,
  PROFILE_VIEW_PATH,
  REPORT_ID_PARAM,
} from '../../../core/router/Routes';
import { getAuthorization } from '../../../core/sagas/authorize/AuthorizeActions';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { getEntityKeyId } from '../../../utils/DataUtils';
import { getFirstLastFromPerson } from '../../../utils/PersonUtils';
import { generateReviewSchema } from '../../../utils/SchemaUtils';

const { CRISIS_REPORT_FQN } = APP_TYPES_FQNS;

const CrisisReportContainerV2 = () => {
  const settings = useAppSettings();
  const dispatch = useDispatch();
  const match = useRouteMatch(CRISIS_REPORT_PATH);

  const dispatchGetAuthorization = useCallback(() => {
    dispatch(getAuthorization());
  }, [dispatch]);

  const [isAuthorized] = useAuthorization('profile', dispatchGetAuthorization);

  const schemaVersion = v2.officer;

  const reviewSchemas = useMemo(
    () => generateReviewSchema(schemaVersion.schemas, schemaVersion.uiSchemas, !isAuthorized),
    [schemaVersion, isAuthorized]
  );

  const entityIndexToIdMap = useSelector((store) => store.getIn(['crisisReport', 'entityIndexToIdMap']));
  const entitySetIds = useSelector((store) => store.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
  const formData = useSelector((store) => store.getIn(['crisisReport', 'formData']));
  const fetchState = useSelector((store) => store.getIn(['crisisReport', 'fetchState']));
  const propertyTypeIds = useSelector((store) => store.getIn(['edm', 'fqnToIdMap'], Map()));
  const reporterData = useSelector((store) => store.getIn(['crisisReport', 'reporterData']));
  const reportData = useSelector((store) => store.getIn(['crisisReport', 'reportData']));
  const subjectData = useSelector((store) => store.getIn(['crisisReport', 'subjectData']));

  const { [REPORT_ID_PARAM]: reportId } = match.params;

  useEffect(() => {
    dispatch(getCrisisReportV2({
      reportEKID: reportId,
      reportFQN: CRISIS_REPORT_FQN,
      reviewSchema: reviewSchemas.schema
    }));

    return () => dispatch(clearCrisisReport());
  }, [dispatch, reportId, settings, reviewSchemas]);

  if (fetchState === RequestStates.PENDING) {
    return <Spinner size="3x" />;
  }

  const handleUpdateCrisisReport = (params) => {
    dispatch(updateCrisisReport({
      ...params,
      entityIndexToIdMap,
    }));
  };

  const handleDeleteCrisisReportContent = (params) => {
    dispatch(deleteCrisisReportContent(params));
  };

  const handleAddOptionalContent = (params) => {
    const existingEKIDs = {
      [CRISIS_REPORT_FQN]: reportId,
    };

    dispatch(addOptionalCrisisReportContent({
      ...params,
      existingEKIDs,
      schema: reviewSchemas.schema,
      reportFQN: CRISIS_REPORT_FQN
    }));
  };

  const handleDeleteReport = () => {
    dispatch(deleteCrisisReport({
      entityKeyId: reportId,
      reportFQN: CRISIS_REPORT_FQN,
      entityIndexToIdMap,
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
  const subjectEKID = getEntityKeyId(subjectData);
  const profilePath = PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, subjectEKID);

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <CardStack>
          <Breadcrumbs>
            <BreadcrumbLink to={profilePath}>{name}</BreadcrumbLink>
            <BreadcrumbItem>{reportData.getIn([FQN.TYPE_FQN, 0], 'Report')}</BreadcrumbItem>
          </Breadcrumbs>
          <BlameCard reporterData={reporterData} />
          <button type="button" onClick={handleDeleteReport}>delete report</button>
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

export default CrisisReportContainerV2;
