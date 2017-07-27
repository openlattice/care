/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';

const DispositionView = ({ section, handleInput, handleCheckboxChange, handleSingleSelection, input }) => {
  return(
    <SectionView header="Disposition">
      <ControlLabel>28. Disposition
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='28a'
              value='arrest'
              checked={input['28a'].indexOf('arrest') !== -1}
              onChange={handleCheckboxChange} />Arrest
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='28a'
              value='ep'
              checked={input['28a'].indexOf('ep') !== -1}
              onChange={handleCheckboxChange} />EP
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='28a'
              value='voluntaryER'
              checked={input['28a'].indexOf('voluntaryER') !== -1}
              onChange={handleCheckboxChange} />Voluntary ER Intake
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='28a'
              value='bcri'
              checked={input['28a'].indexOf('bcri') !== -1}
              onChange={handleCheckboxChange} />BCRI
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='28a'
              value='infoAndReferral'
              checked={input['28a'].indexOf('infoAndReferral') !== -1}
              onChange={handleCheckboxChange} />Information and Referral
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='28a'
              value='lead'
              checked={input['28a'].indexOf('lead') !== -1}
              onChange={handleCheckboxChange} />LEAD
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='28a'
              value='contactedTreatementProvider'
              checked={input['28a'].indexOf('contactedTreatementProvider') !== -1}
              onChange={handleCheckboxChange} />Contacted or Referred to Current Treatment Provider
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='28a'
              value='criminalCitation'
              checked={input['28a'].indexOf('criminalCitation') !== -1}
              onChange={handleCheckboxChange} />Criminal Citation
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name='28a'
              value='civilCitation'
              checked={input['28a'].indexOf('civilCitation') !== -1}
              onChange={handleCheckboxChange} />Civil Citation
        </ControlLabel>
      </ControlLabel>
      <ControlLabel>Transported to Hospital
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='28b'
              value='yes'
              checked={input['28b'] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='28b'
              value='no'
              checked={input['28b'] === 'no'}
              onChange={handleSingleSelection} />No
        </ControlLabel>
      </ControlLabel>
      <ControlLabel>Hospital Name
        <FormControl data-section={section} name='28c' value={input['28c']} onChange={handleInput}></FormControl>
      </ControlLabel>
    </SectionView>
  );
}

export default DispositionView;
