/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';

const ConsumerInfoView = ({ section, handleInput, handleRadioChange, input }) => {

  return (
    <SectionView header='Consumer Info'>
      <FormGroup>
        <ControlLabel>13. Consumer Name (Last, First, MI)
          <FormControl data-section={section} name='13a' value={input['13a']} onChange={handleInput}></FormControl>
        </ControlLabel>
        <ControlLabel>Residence Address (include Apt, City, County, State and Zip)
          <FormControl data-section={section} name='13b' value={input['13b']} onChange={handleInput}></FormControl>
        </ControlLabel>
        <ControlLabel>Consumer phone number
          <FormControl data-section={section} name='13c' value={input['13c']} onChange={handleInput}></FormControl>
        </ControlLabel>
      </FormGroup>
      <FormGroup>
        <ControlLabel>14. Military Status
          <ControlLabel>
            <input
                type='radio'
                data-section={section}
                name='14a'
                value='active'
                checked={input['14a'] === 'active'}
                onChange={handleRadioChange} />Active
          </ControlLabel>
          <ControlLabel>
            <input
                type='radio'
                data-section={section}
                name ='14a' 
                value='veteran'
                checked={input['14a'] === 'veteran'}
                onChange={handleRadioChange} />Veteran
          </ControlLabel>
          <ControlLabel>
            <input
                type='radio'
                data-section={section}
                name ='14a'
                value='n/a'
                checked={input['14a'] === 'n/a'}
                onChange={handleRadioChange} />N/A
          </ControlLabel>
          <ControlLabel>Gender
            <FormControl componentClass='select' placeholder='select'>
              <option data-section={section} name='14b' value='select'>select</option>
              <option data-section={section} name='14b' value='female'>female</option>
              <option data-section={section} name='14b' value='male'>male</option>
            </FormControl>
          </ControlLabel>
          <ControlLabel>Race
            <FormControl componentClass='select' placeholder='select'>
              <option data-section={section} name='14c' value='select'>select</option>
              <option data-section={section} name='14c' value='americanIndian'>American Indian or Alaska Native</option>
              <option data-section={section} name='14c' value='asian'>Asian</option>
              <option data-section={section} name='14c' value='black'>Black or African American</option>
              <option data-section={section} name='14c' value='hispanic'>Hispanic or Latino</option>
              <option data-section={section} name='14c' value='nativeHawaiian'>Native Hawaiian or Other Pacific Islander</option>
              <option data-section={section} name='14c' value='white'>White</option>
              <option data-section={section} name='14c' value='other'>Other</option>
            </FormControl>
          </ControlLabel>
        </ControlLabel>
        <ControlLabel>Age
          <FormControl data-section={section} name='14d' value={input['14d']} onChange={handleInput}></FormControl>
        </ControlLabel>
        <ControlLabel>DOB
          <FormControl data-section={section} name='14e' value={input['14e']} onChange={handleInput}></FormControl>
        </ControlLabel>
      </FormGroup>
    </SectionView>

  );
}

export default ConsumerInfoView;
