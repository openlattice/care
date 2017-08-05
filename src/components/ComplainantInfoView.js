/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';
import { Row, TextInput, Label, InputWrapper } from '../shared/Layout';
import { FLEX } from '../shared/Consts';

const ComplainantInfoView = ({ section, handleInput, input }) => {
  return(
    <SectionView header="Complainant/Next of Kin Information">
      <Row>
        <InputWrapper flex={FLEX['1_4']}>
          <Label>27. Complainant Name (Last, First, MI)</Label>
          <TextInput data-section={section} name='27a' value={input['27a']} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX['1_4']}>
          <Label>Address (Apt Number, City, County, State, Zip)</Label>
          <TextInput data-section={section} name='27b' value={input['27b']} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX['1_4']}>
          <Label>Relationship to Consumer</Label>
          <TextInput data-section={section} name='27c' value={input['27c']} onChange={handleInput} />
        </InputWrapper>
        <InputWrapper flex={FLEX['1_4']}>
          <Label>Phone Number</Label>
          <TextInput data-section={section} name='27d' value={input['27d']} onChange={handleInput} />
        </InputWrapper>
      </Row>
    </SectionView>
  );
}

export default ComplainantInfoView;
