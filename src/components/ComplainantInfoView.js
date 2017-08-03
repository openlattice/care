/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';
import { Row, TextInput, Label } from '../shared/Layout';

const ComplainantInfoView = ({ section, handleInput, input }) => {
  return(
    <SectionView header="Complainant/Next of Kin Information">
      <Row>
        <Label>27. Complainant Name (Last, First, MI)</Label>
        <TextInput data-section={section} name='27a' value={input['27a']} onChange={handleInput} />
        <Label>Address (Include Apartment Number, City, County, State, Zip) if Applicable</Label>
        <TextInput data-section={section} name='27b' value={input['27b']} onChange={handleInput} />
      </Row>
      <Row>
        <Label>Relationship to Consumer</Label>
        <TextInput data-section={section} name='27c' value={input['27c']} onChange={handleInput} />
        <Label>Phone Number</Label>
        <TextInput data-section={section} name='27d' value={input['27d']} onChange={handleInput} />
      </Row>
    </SectionView>
  );
}

export default ComplainantInfoView;
