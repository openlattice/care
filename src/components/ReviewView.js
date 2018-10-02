import React from 'react';

import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

import ReportInfoView from './ReportInfoView';
import ConsumerInfoView from './ConsumerInfoView';
import ComplainantInfoView from './ComplainantInfoView';
import DispositionView from './DispositionView';
import OfficerInfoView from './OfficerInfoView';

const { NEUTRALS } = Colors;

const ReviewHeader = styled.h1`
  color: ${NEUTRALS[0]};
  font-size: 32px;
  font-weight: normal;
  margin: 0 0 30px 0;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 60px;
`;

const ReviewView = ({
  complainantInfo,
  consumerInfo,
  consumerIsSelected,
  dispositionInfo,
  officerInfo,
  reportInfo,
  selectedOrganizationId,
  updateStateValue,
  updateStateValues,
}) => {

  return (
    <>
      <ReviewHeader>Review</ReviewHeader>
      <Section>
        <ReportInfoView
            input={reportInfo}
            isInReview
            isReadOnly
            selectedOrganizationId={selectedOrganizationId}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
      </Section>
      <Section>
        <ConsumerInfoView
            consumerIsSelected={consumerIsSelected}
            input={consumerInfo}
            isInReview
            isReadOnly
            selectedOrganizationId={selectedOrganizationId}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
      </Section>
      <Section>
        <ComplainantInfoView
            input={complainantInfo}
            isInReview
            isReadOnly
            selectedOrganizationId={selectedOrganizationId}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
      </Section>
      <Section>
        <DispositionView
            input={dispositionInfo}
            isInReview
            isReadOnly
            selectedOrganizationId={selectedOrganizationId}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
      </Section>
      <Section>
        <OfficerInfoView
            input={officerInfo}
            isInReview
            isReadOnly
            selectedOrganizationId={selectedOrganizationId}
            updateStateValue={updateStateValue}
            updateStateValues={updateStateValues} />
      </Section>
    </>
  );
};

export default ReviewView;
