// @flow
import React, { useRef } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Form, PagedByMachine } from 'lattice-fabricate';
import {
  Button,
  Card,
  CardStack
} from 'lattice-ui-kit';

import { crisisMachine } from './machine/crisisMachine';
import { xSchemas, xUiSchemas } from './schemas';

import ProfileBanner from '../../profile/ProfileBanner';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';

const initialFormData = {
  page3section1: {
    '0__@@__app.people__@@__nc.PersonSurName': [
      'Homicidal thoughts'
    ],
    '1__@@__app.people__@@__nc.PersonSurName': [
      'Mania'
    ]
  },
  page2section1: {
    '0__@@__app.people__@@__nc.PersonSurName': '2019-12-19T13:37:58.493-08:00'
  },
  page1section1: {
    '0__@@__app.people__@@__im.PersonNickName': [],
    '0__@@__app.people__@@__nc.PersonSurName': 'fdsa',
    '0__@@__app.people__@@__nc.PersonGivenName': 'fdsada',
    '0__@@__app.people__@@__nc.PersonBirthDate': '2019-12-05',
    '0__@@__app.people__@@__nc.PersonSex': 'Male',
    '0__@@__app.people__@@__nc.PersonRace': 'White',
    '0__@@__app.people__@@__nc.PersonEthnicity': 'Non-Hispanic'
  }
};

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px 30px 30px;
`;

const ReviewBody = styled.div`
  padding: 30px 30px 30px;
  white-space: pre;
`;

const mockPerson = Map();

const onPageChange = (page, formData) => console.log(page, formData);

const XStateCrisisReportContainer = () => {
  const pageRef = useRef();
  return (
    <ContentOuterWrapper ref={pageRef}>
      <ProfileBanner selectedPerson={mockPerson} />
      <ContentWrapper>
        <CardStack>
          <Card>
            <PagedByMachine
                initialFormData={initialFormData}
                machine={crisisMachine}
                onPageChange={onPageChange}
                render={({
                  formRef,
                  pagedData,
                  page,
                  onBack,
                  onNext,
                  validateAndSubmit,
                }) => {

                  const isInitialPage = page === crisisMachine.initialState.value;
                  const isReviewPage = page === 'review';

                  const validate = isReviewPage
                    ? () => console.log(pagedData)
                    : validateAndSubmit;

                  const handleNext = () => {
                    if (pageRef.current) {
                      pageRef.current.scrollIntoView();
                    }
                    onNext();
                  };

                  const handleBack = () => {
                    if (pageRef.current) {
                      pageRef.current.scrollIntoView();
                    }
                    onBack();
                  };

                  return (
                    <>
                      {
                        isReviewPage
                          ? <ReviewBody>{JSON.stringify(pagedData, true, 2)}</ReviewBody>
                          : (
                            <Form
                                formData={pagedData}
                                hideSubmit
                                onSubmit={handleNext}
                                ref={formRef}
                                schema={xSchemas[page]}
                                uiSchema={xUiSchemas[page]} />
                          )
                      }
                      <ActionRow>
                        <Button
                            disabled={isInitialPage}
                            onClick={handleBack}>
                            Back
                        </Button>
                        <Button
                            mode="primary"
                            onClick={validate}>
                          { isReviewPage ? 'Submit' : 'Next' }
                        </Button>
                      </ActionRow>
                    </>
                  );
                }} />
          </Card>
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );

};

export default XStateCrisisReportContainer;
