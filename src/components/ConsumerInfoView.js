/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';

import SectionView from './SectionView';

const ConsumerInfoView = ({ section, handleInput, handleSingleSelection, handleCheckboxChange, input }) => {

  return (
    <SectionView header='Consumer Info'>

      <ControlLabel>13. Consumer Name (Last, First, MI)
        <FormControl data-section={section} name='13a' value={input['13a']} onChange={handleInput}></FormControl>
      </ControlLabel>
      <ControlLabel>Residence Address (include Apt, City, County, State and Zip)
        <FormControl data-section={section} name='13b' value={input['13b']} onChange={handleInput}></FormControl>
      </ControlLabel>
      <ControlLabel>Consumer phone number
        <FormControl data-section={section} name='13c' value={input['13c']} onChange={handleInput}></FormControl>
      </ControlLabel>

      <ControlLabel>14. Military Status
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='14a'
              value='active'
              checked={input['14a'] === 'active'}
              onChange={handleSingleSelection} />Active
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name ='14a' 
              value='veteran'
              checked={input['14a'] === 'veteran'}
              onChange={handleSingleSelection} />Veteran
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name ='14a'
              value='n/a'
              checked={input['14a'] === 'n/a'}
              onChange={handleSingleSelection} />N/A
        </ControlLabel>
        <ControlLabel>Gender
          <FormControl
              componentClass='select'
              placeholder='select'
              data-section={section}
              name='14b'
              value={input['14b']}
              onChange={handleSingleSelection}>
            <option value=''>select</option>
            <option value='female'>female</option>
            <option value='male'>male</option>
          </FormControl>
        </ControlLabel>
        <ControlLabel>Race
          <FormControl
              componentClass='select'
              placeholder='select'
              data-section={section}
              name='14c'
              value={input['14c']}
              onChange={handleSingleSelection}>
            <option value=''>select</option>
            <option value='americanIndian'>American Indian or Alaska Native</option>
            <option value='asian'>Asian</option>
            <option value='black'>Black or African American</option>
            <option value='hispanic'>Hispanic or Latino</option>
            <option value='nativeHawaiian'>Native Hawaiian or Other Pacific Islander</option>
            <option value='white'>White</option>
            <option value='other'>Other</option>
          </FormControl>
        </ControlLabel>
      </ControlLabel>
      <ControlLabel>Age
        <FormControl data-section={section} name='14d' value={input['14d']} onChange={handleInput}></FormControl>
      </ControlLabel>
      <ControlLabel>DOB
        <FormControl data-section={section} name='14e' value={input['14e']} onChange={handleInput}></FormControl>
      </ControlLabel>

      <ControlLabel>15. Homeless
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name={15}
              value='yes'
              checked={input[15] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name ={15} 
              value='no'
              checked={input[15] === 'no'}
              onChange={handleSingleSelection} />No
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>16. Consumer Using Drugs, Alcohol, Both
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name={16}
              value='drugs'
              checked={input[16] === 'drugs'}
              onChange={handleSingleSelection} />Drugs
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name ={16} 
              value='alcohol'
              checked={input[16] === 'alcohol'}
              onChange={handleSingleSelection} />Alcohol
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name ={16} 
              value='both'
              checked={input[16] === 'both'}
              onChange={handleSingleSelection} />Both
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name ={16} 
              value='n/a'
              checked={input[16] === 'n/a'}
              onChange={handleSingleSelection} />N/A
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>17. Prescribed Medication
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='17a'
              value='yes'
              checked={input['17a'] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='17a'
              value='no'
              checked={input['17a'] === 'no'}
              onChange={handleSingleSelection} />No
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='17a' 
              value='unk'
              checked={input['17a'] === 'unk'}
              onChange={handleSingleSelection} />Unk
        </ControlLabel>
      </ControlLabel>
      <ControlLabel>Taking Medication
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='17b'
              value='yes'
              checked={input['17b'] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='17b' 
              value='no'
              checked={input['17b'] === 'no'}
              onChange={handleSingleSelection} />No
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name='17b' 
              value='unk'
              checked={input['17b'] === 'unk'}
              onChange={handleSingleSelection} />Unk
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>18. Prev Psych Hospital Admission
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name={18}
              value='yes'
              checked={input[18] === 'yes'}
              onChange={handleSingleSelection} />Yes
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name={18}
              value='no'
              checked={input[18] === 'no'}
              onChange={handleSingleSelection} />No
        </ControlLabel>
        <ControlLabel>
          <input
              type='radio'
              data-section={section}
              name={18} 
              value='unk'
              checked={input[18] === 'unk'}
              onChange={handleSingleSelection} />Unk
        </ControlLabel>
      </ControlLabel>

      <ControlLabel>19. Self Diagnosis
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={19}
              checked={input[19].indexOf('bipolar') !== -1}
              value='bipolar'
              onChange={handleCheckboxChange} />Bipolar
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={19}
              value='depression'
              checked={input[19].indexOf('depression') !== -1}
              onChange={handleCheckboxChange} />Depression
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={19} 
              value='ptsd'
              checked={input[19].indexOf('ptsd') !== -1}
              onChange={handleCheckboxChange} />PTSD
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={19}
              checked={input[19].indexOf('schizophrenia') !== -1}
              value='schizophrenia'
              onChange={handleCheckboxChange} />Schizophrenia
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={19}
              value='dementia'
              checked={input[19].indexOf('dementia') !== -1}
              onChange={handleCheckboxChange} />Dementia
        </ControlLabel>
        <ControlLabel>
          <Checkbox
              data-section={section}
              name={19} 
              value='other'
              checked={input[19].indexOf('other') !== -1}
              onChange={handleCheckboxChange} />Other
        </ControlLabel>
      </ControlLabel>
    </SectionView>

  );
}

export default ConsumerInfoView;

// NEXT: CREATE CONTROLLED SELECT COMPONENT
