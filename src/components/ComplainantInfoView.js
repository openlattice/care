/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';

const ComplainantInfoView = ({ section, handleInput, input }) => {
  return(
    <SectionView header="Complainant/Next of Kin Information">
      <ControlLabel>27. Complainant Name (Last, First, MI)
        <FormControl data-section={section} name='27a' value={input['27a']} onChange={handleInput}></FormControl>
      </ControlLabel>
      <ControlLabel>Address (Include Apartment Number, City, County, State, Zip) if Applicable
        <FormControl data-section={section} name='27b' value={input['27b']} onChange={handleInput}></FormControl>
      </ControlLabel>
      <ControlLabel>Relationship to Consumer
        <FormControl data-section={section} name='27c' value={input['27c']} onChange={handleInput}></FormControl>
      </ControlLabel>
      <ControlLabel>Phone Number
        <FormControl data-section={section} name='27d' value={input['27d']} onChange={handleInput}></FormControl>
      </ControlLabel>
    </SectionView>
  );
}

export default ComplainantInfoView;
