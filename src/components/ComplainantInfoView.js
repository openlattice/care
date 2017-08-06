/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

import SectionView from './SectionView';
import { Row, TextInput, InputWrapper, TitleLabel } from '../shared/Layout';
import { FLEX } from '../shared/Consts';

const ComplainantInfoView = ({ section, handleInput, input }) => {
  return(
    <SectionView header="Complainant/Next of Kin Information">
      <Row>
        <InputWrapper flex={FLEX['1_4']}>
          <TitleLabel>27. Complainant Name (Last, First, MI)</TitleLabel>
          <TextInput data-section={section} name='27a' value={input['27a']} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX['1_4']}>
          <TitleLabel>Address (Apt Number, City, County, State, Zip)</TitleLabel>
          <TextInput data-section={section} name='27b' value={input['27b']} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX['1_4']}>
          <TitleLabel>Relationship to Consumer</TitleLabel>
          <TextInput data-section={section} name='27c' value={input['27c']} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX['1_4']}>
          <TitleLabel>Phone Number</TitleLabel>
          <TextInput data-section={section} name='27d' value={input['27d']} onChange={handleInput} />
        </InputWrapper>
      </Row>
    </SectionView>
  );
}

export default ComplainantInfoView;
