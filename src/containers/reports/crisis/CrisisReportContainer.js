// @flow
import React, { useCallback, useEffect, useMemo } from 'react';

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
  clearCrisisReport,
  getCrisisReport,
  updateCrisisReport,
} from './CrisisActions';
import { v1 } from './schemas';

import BlameCard from '../shared/BlameCard';
import * as FQN from '../../../edm/DataModelFqns';
import { BreadcrumbItem, BreadcrumbLink } from '../../../components/breadcrumbs';
import { useAuthorization } from '../../../components/hooks';
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

const {
  BEHAVIORAL_HEALTH_REPORT_FQN,
} = APP_TYPES_FQNS;

const CrisisReportContainer = () => {
  const dispatch = useDispatch();
  const match = useRouteMatch(CRISIS_REPORT_PATH);

  const dispatchGetAuthorization = useCallback(() => {
    dispatch(getAuthorization());
  }, [dispatch]);

  const [isAuthorized] = useAuthorization('profile', dispatchGetAuthorization);

  const entityIndexToIdMap = useSelector((store) => store.getIn(['crisisReport', 'entityIndexToIdMap']));
  const entitySetIds = useSelector((store) => store.getIn(['app', 'selectedOrgEntitySetIds']));
  const formData = useSelector((store) => store.getIn(['crisisReport', 'formData']));
  const fetchState = useSelector((store) => store.getIn(['crisisReport', 'fetchState']));
  const propertyTypeIds = useSelector((store) => store.getIn(['edm', 'fqnToIdMap']));
  const reporterData = useSelector((store) => store.getIn(['crisisReport', 'reporterData']));
  const reportData = useSelector((store) => store.getIn(['crisisReport', 'reportData']));
  const subjectData = useSelector((store) => store.getIn(['crisisReport', 'subjectData']));
  const remoteSchemas = useSelector((store) => store.getIn(['formSchemas', 'schemas', 'CRISIS_REPORT']));

  const { [REPORT_ID_PARAM]: reportId } = match.params;

  const reviewSchemas = useMemo(
    () => {
      let schemaVersion = v1;
      if (remoteSchemas) {
        schemaVersion = remoteSchemas.toJS();
      }
      return generateReviewSchema(schemaVersion.schemas, schemaVersion.uiSchemas, !isAuthorized);
    },
    [remoteSchemas, isAuthorized]
  );

  useEffect(() => {
    dispatch(getCrisisReport({
      reportEKID: reportId,
      reportFQN: BEHAVIORAL_HEALTH_REPORT_FQN,
    }));

    return () => dispatch(clearCrisisReport());
  }, [dispatch, reportId]);

  if (fetchState === RequestStates.PENDING) {
    return <Spinner size="3x" />;
  }

  const handleUpdateCrisisReport = (params) => {
    dispatch(updateCrisisReport({
      ...params,
      entityIndexToIdMap,
    }));
  };

  const name = getFirstLastFromPerson(subjectData);
  const formContext = {
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
