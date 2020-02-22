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
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Redirect } from 'react-router-dom';

import { submitCrisisReport } from './CrisisActions';
import { crisisMachine } from './machine/crisisMachine';
import { xSchemas, xUiSchemas } from './schemas';
import { mergeSchemas } from './schemas/schemaUtils';

import ProfileBanner from '../../profile/ProfileBanner';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { HOME_PATH } from '../../../core/router/Routes';

const initialFormData = {
  page7section1: {
    '0__@@__app.insurance__@@__general.status': 'Primary',
    '1__@@__app.insurance__@@__general.status': 'Secondary',
    '0__@@__app.insurance__@@__ol.organizationname': 'Private',
    '1__@@__app.insurance__@@__ol.organizationname': 'Medicare'
  },
  page6section1: {
    '0__@@__app.housing__@@__ol.type': [
      'Permanent Residence',
      'Stable Housing'
    ],
    '0__@@__app.housing__@@__ol.description': [
      'Caregiver',
      'Children'
    ],
    '0__@@__app.income__@@__ol.type': [
      'DCF',
      'DDS'
    ]
  },
  page5section1: {
    '0__@@__app.weapon__@@__ol.type': [
      'Gun',
      'Knife'
    ],
    '0__@@__app.violentbehavior__@@__ol.directedrelation': [
      'Bystander',
      'Co-worker',
      'Family Member'
    ],
    '0__@@__app.injury__@@__ol.personinjured': [
      'Bystander',
      'Co-worker',
      'Family Member'
    ],
    '0__@@__app.selfharm__@@__ol.action': [
      'Suicide Attempt',
      'Suicidal Ideation'
    ]
  },
  page4section1: [
    {
      '-1__@@__app.diagnosis__@@__ol.name': 'asdfas'
    },
    {
      '-1__@@__app.diagnosis__@@__ol.name': 'fdsafdsa'
    }
  ],
  page4section2: [
    {
      '-1__@@__app.medicationstatement__@@__ol.name': 'afsda',
      '-1__@@__app.medicationstatement__@@__ol.takenasprescribed': 'Yes'
    },
    {
      '-1__@@__app.medicationstatement__@@__ol.name': 'fdsa',
      '-1__@@__app.medicationstatement__@@__ol.takenasprescribed': 'No'
    }
  ],
  page4section3: {
    '0__@@__app.substance__@@__ol.type': [
      'Unknown',
      'Prescription',
      'Opioids'
    ],
    '0__@@__app.substancehistory__@@__ol.type': [
      'Alcohol',
      'Cocaine',
      'Opioids'
    ]
  },
  page3section1: {
    '0__@@__app.natureofcrisis__@@__ol.description': [
      'Acute stress',
      'Self-harm',
      'Homicidal thoughts'
    ],
    '0__@@__app.behavior__@@__ol.observedbehavior': [
      'Belligerent',
      'Bizzare, unusual behavior',
      'Disorientation'
    ]
  },
  page2section1: {
    '0__@@__app.incident_new__@@__ol.datetimestart': '2020-02-14T11:00:15.802-08:00',
    '0__@@__app.incident_new__@@__criminaljustice.casenumber': '123',
    '0__@@__app.location__@@__location.address': '123',
    '0__@@__app.incident_new__@@__ol.description': 'summary\n'
  },

};

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px 30px 30px;
`;

const XStateCrisisReportContainer = () => {
  const location = useLocation();
  const pageRef = useRef();
  const dispatch = useDispatch();
  const reviewSchemas = {
    schema: {
      properties: {}
    },
    uiSchema: {}
  };

  const onPageChange = (page, formData) => {
    console.log(page, formData);
    if (xSchemas[page] && xUiSchemas[page]) {
      mergeSchemas(
        reviewSchemas,
        {
          schema: xSchemas[page],
          uiSchema: xUiSchemas[page]
        }
      );
    }
  };

  const { state: selectedPerson = Map() } = location;
  if (!Map.isMap(selectedPerson) || selectedPerson.isEmpty()) return <Redirect to={HOME_PATH} />;

  return (
    <ContentOuterWrapper ref={pageRef}>
      <ProfileBanner selectedPerson={selectedPerson} />
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
                    ? () => {
                      dispatch(submitCrisisReport({ formData: pagedData, selectedPerson }));
                    }
                    : validateAndSubmit;

                  const handleNext = () => {
                    if (pageRef.current) {
                      pageRef.current.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }
                    onNext();
                  };

                  const handleBack = () => {
                    if (pageRef.current) {
                      pageRef.current.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }
                    onBack();
                  };

                  return (
                    <>
                      <Form
                          formData={pagedData}
                          hideSubmit
                          onSubmit={handleNext}
                          ref={formRef}
                          schema={isReviewPage ? reviewSchemas.schema : xSchemas[page]}
                          uiSchema={isReviewPage ? reviewSchemas.uiSchema : xUiSchemas[page]} />
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
