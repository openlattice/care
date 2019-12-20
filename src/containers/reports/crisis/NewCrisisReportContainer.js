// @flow
import React from 'react';

import styled from 'styled-components';
import { Form, Paged } from 'lattice-fabricate';
import {
  Button,
  Card,
  CardStack
} from 'lattice-ui-kit';

import { schemas, uiSchemas } from './schemas';

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

const onPageChange = (page, formData) => console.log(page, formData);

type Props = {

};

const NewCrisisReportContainer = (props :Props) => {
  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <CardStack>
          <Card>
            <Paged
                // initialFormData={initialFormData}
                onPageChange={onPageChange}
                render={({
                  formRef,
                  pagedData,
                  page,
                  onBack,
                  onNext,
                  validateAndSubmit,
                }) => {
                  const totalPages = 6;
                  const isLastPage = page === totalPages - 1;

                  const handleNext = isLastPage
                    ? () => console.log(pagedData)
                    : validateAndSubmit;

                  return (
                    <>
                      <Form
                          formData={pagedData}
                          hideSubmit
                          onSubmit={onNext}
                          ref={formRef}
                          schema={schemas[page]}
                          uiSchema={uiSchemas[page]} />
                      <ActionRow>
                        <Button
                            disabled={!(page > 0)}
                            onClick={onBack}>
                            Back
                        </Button>
                        <span>{`${page + 1} of ${totalPages}`}</span>
                        <Button
                            mode="primary"
                            onClick={handleNext}>
                          { isLastPage ? 'Submit' : 'Next' }
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

export default NewCrisisReportContainer;
