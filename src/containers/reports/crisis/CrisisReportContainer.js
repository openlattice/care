// @flow
import React, { useEffect } from 'react';

import { Form } from 'lattice-fabricate';
import { Card } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

import { getCrisisReport } from './CrisisActions';
import { schemas, uiSchemas } from './schemas';
import { generateReviewSchema } from './schemas/schemaUtils';

import { useAuthorization } from '../../../components/hooks';
// import ProfileBanner from '../../profile/ProfileBanner';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { REPORT_ID_PARAM } from '../../../core/router/Routes';
import { getAuthorization } from '../../../core/sagas/authorize/AuthorizeActions';
import { APP_TYPES_FQNS } from '../../../shared/Consts';

const {
  CLINICIAN_REPORT_FQN
} = APP_TYPES_FQNS;

const CrisisReportContainer = () => {
  const reviewSchemas = generateReviewSchema(schemas, uiSchemas);
  const [isAuthorized] = useAuthorization('profile', getAuthorization);
  const formData = useSelector((store) => store.getIn(['crisisReport', 'formData']));
  const dispatch = useDispatch();
  const match = useRouteMatch();

  const { [REPORT_ID_PARAM]: reportId } = match.params;

  useEffect(() => {
    dispatch(getCrisisReport({
      reportEKID: reportId,
      reportFQN: CLINICIAN_REPORT_FQN
    }));
  }, [dispatch, reportId]);

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <Card>
          Crisis Report
          <Form
              disabled
              formData={formData}
              schema={reviewSchemas.schema}
              uiSchema={reviewSchemas.uiSchema} />
        </Card>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default CrisisReportContainer;
