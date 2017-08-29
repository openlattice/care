/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { Button } from 'react-bootstrap';

import ReportInfoView from '../components/ReportInfoView';
import ConsumerInfoView from '../components/ConsumerInfoView';
import ComplaintInfoView from '../components/ComplaintInfoView';
import DispositionView from '../components/DispositionView';
import OfficerInfoView from '../components/OfficerInfoView';


const SectionWrapperView = ({ handleTextInput, handleDateInput, handleTimeInput, handleSingleSelection, handleCheckboxChange, input, page, handlePageChange, ...props }) => {
  const renderSection = (page) => {
    console.log('page:', page);
    switch(page) {
      case 1:
        return (
          <ReportInfoView
              handleTextInput={handleTextInput}
              handleDateInput={handleDateInput}
              handleTimeInput={handleTimeInput}
              handleSingleSelection={handleSingleSelection}
              input={input.reportInfo}
              section='reportInfo' />
        );
      case 2:
        return (
          <ConsumerInfoView
              handleTextInput={handleTextInput}
              handleDateInput={handleDateInput}
              handleSingleSelection={handleSingleSelection}
              handleCheckboxChange={handleCheckboxChange}
              input={input.consumerInfo}
              section='consumerInfo' />
        );
      case 3:
        return (
          <ComplaintInfoView
              handleTextInput={handleTextInput}
              input={input.complainantInfo}
              section='complainantInfo' />
        );
      case 4:
        return (
          <DispositionView
              handleTextInput={handleTextInput}
              handleCheckboxChange={handleCheckboxChange}
              handleSingleSelection={handleSingleSelection}
              input={input.dispositionInfo}
              section='dispositionInfo' />
        );
      case 5:
        return (
          <OfficerInfoView
              handleTextInput={handleTextInput}
              handleCheckboxChange={handleCheckboxChange}
              input={input.officerInfo}
              section='officerInfo' />
        );
      default:
        return (
          <ReportInfoView
              handleTextInput={handleTextInput}
              handleDateInput={handleDateInput}
              handleTimeInput={handleTimeInput}
              handleSingleSelection={handleSingleSelection}
              input={input.reportInfo}
              section='reportInfo' />
        );
    }
    return (
      <div>SECTION</div>
    );
  }

  return (
    <div>
      <h2>Progress Bar</h2>
      { renderSection(page) }
      { page > 1 ? <Button onClick={() => handlePageChange('prev')}>Prev</Button> : null }
      { <Button onClick={() => handlePageChange('next')}>Next</Button> }
    </div>
  );
}

SectionWrapperView.propTypes = {
  page: PropTypes.number.isRequired
};

export default SectionWrapperView;
