// @flow
import React, { useCallback, useRef } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Button, Card, CardStack } from 'lattice-ui-kit';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import NewPerson from './NewPersonForm';
import NewPersonSuccess from './NewPersonSuccess';

import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { HOME_PATH } from '../../core/router/Routes';

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 30px 30px 30px;
`;

const NewPersonContainer = () => {
  const formRef = useRef();
  const submitState :RequestState = useSelector((store) => store.getIn(['people', 'submitState']));
  const createdPerson :Map = useSelector((store) => store.getIn(['people', 'createdPerson']));
  const searchInputs :Map = useSelector((store) => store.getIn(['people', 'searchInputs']));

  const isSubmitting = submitState === RequestStates.PENDING;
  const submitSuccess = submitState === RequestStates.SUCCESS;

  const handleExternalSubmit = useCallback(() => {
    if (formRef.current) {
      formRef.current.submit();
    }
  }, []);

  const emptySearchInputs = searchInputs.equals(Map({
    dob: undefined,
    firstName: '',
    lastName: '',
    ethnicity: undefined,
    race: undefined,
    sex: undefined
  }));

  if (!Map.isMap(searchInputs) || emptySearchInputs) return <Redirect to={HOME_PATH} />;

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <CardStack>
          {
            submitSuccess
              ? (<NewPersonSuccess createdPerson={createdPerson} />)
              : (
                <Card>
                  <NewPerson
                      ref={formRef} />
                  <ActionRow>
                    <Button
                        fullWidth
                        isLoading={isSubmitting}
                        mode="primary"
                        onClick={handleExternalSubmit}>
                      Submit
                    </Button>
                  </ActionRow>
                </Card>
              )
          }
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default NewPersonContainer;
