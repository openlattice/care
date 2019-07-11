import React from 'react';
// import { Switch, Route } from 'react-router-dom';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import StepNavBar from './StepNavBar';

const EditProfileContainer = () => (
  <ContentOuterWrapper>
    <ContentWrapper>
      <StepNavBar>
        <div>i am content 1</div>
        <div>i am content 2</div>
      </StepNavBar>
    </ContentWrapper>
  </ContentOuterWrapper>
);

export default EditProfileContainer;
