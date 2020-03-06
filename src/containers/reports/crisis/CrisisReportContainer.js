// @flow
import React, { useEffect } from 'react';

import { Map } from 'immutable';
import { Form } from 'lattice-fabricate';
import { Card } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

import { deleteCrisisReportContent, getCrisisReport, updateCrisisReport } from './CrisisActions';
import { schemas, uiSchemas } from './schemas';
import { generateReviewSchema } from './schemas/schemaUtils';

import { useAuthorization } from '../../../components/hooks';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { REPORT_ID_PARAM } from '../../../core/router/Routes';
import { getAuthorization } from '../../../core/sagas/authorize/AuthorizeActions';
import { APP_TYPES_FQNS } from '../../../shared/Consts';

const {
  CLINICIAN_REPORT_FQN
} = APP_TYPES_FQNS;

const CrisisReportContainer = () => {
  const [isAuthorized] = useAuthorization('profile', getAuthorization);
  const reviewSchemas = generateReviewSchema(schemas, uiSchemas, !isAuthorized);
  const formData = useSelector((store) => store.getIn(['crisisReport', 'formData']));
  const entityIndexToIdMap = useSelector((store) => store.getIn(['crisisReport', 'entityIndexToIdMap']));
  const entitySetIds = useSelector((store) => store.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
  const propertyTypeIds = useSelector((store) => store.getIn(['edm', 'fqnToIdMap'], Map()));
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const { [REPORT_ID_PARAM]: reportId } = match.params;

  useEffect(() => {
    dispatch(getCrisisReport({
      reportEKID: reportId,
      reportFQN: CLINICIAN_REPORT_FQN
    }));
  }, [dispatch, reportId]);

  const handleUpdateCrisisReport = (params) => {
    dispatch(updateCrisisReport(params));
  };

  const handleDeleteCrisisReportContent = (params) => {
    dispatch(deleteCrisisReportContent(params));
  };

  const formContext = {
    deleteAction: handleDeleteCrisisReportContent,
    editAction: handleUpdateCrisisReport,
    entityIndexToIdMap,
    entitySetIds,
    propertyTypeIds,
  };

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <Card>
          Crisis Report
          <Form
              disabled
              formContext={formContext}
              formData={formData.toJS()}
              schema={reviewSchemas.schema}
              uiSchema={reviewSchemas.uiSchema} />
        </Card>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default CrisisReportContainer;
