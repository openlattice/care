/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { Button, ProgressBar } from 'react-bootstrap';

import ReportInfoView from '../components/ReportInfoView';
import ConsumerInfoView from '../components/ConsumerInfoView';
import ComplainantInfoView from '../components/ComplainantInfoView';
import DispositionView from '../components/DispositionView';
import OfficerInfoView from '../components/OfficerInfoView';
import { SubmitButton } from '../shared/Layout';


const StyledProgressBar = styled(ProgressBar)`
  margin: 60px 0;
  position: relative;
`;

const Header = styled.div`
  font-size: 32px;
  margin-bottom: 40px;
  color: #37454A;
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

const NavBtnWrapper = styled.div`
  position: absolute;
  width: 300px;
  left: 50%;
  margin-left: -150px;
  text-align: center;
`;

const StyledButton = styled(Button)`
  margin: 0 10px;
`;


// When it receives props and the page has changed, window.scrollTo(0,0)
const SectionWrapperView = ({ handleTextInput, handleDateInput, handleTimeInput, handleSingleSelection, handleCheckboxChange, input, page, maxPage, handlePageChange, ...props }) => {
  const renderHeader = (page) => {
    switch(page) {
      case 1:
        return <Header>Report Information</Header>;
      case 2:
        return <Header>Consumer Information</Header>;
      case 3:
        return <Header>Complainant Information</Header>;
      case 4:
        return <Header>Disposition Information</Header>;
      case 5:
        return <Header>Officer Information</Header>;
      default:
        return;
    }
  }

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
          <ComplainantInfoView
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
        return;
    }
    return (
      <div>SECTION</div>
    );
  }

  const getProgress = () => {
    const num = Math.ceil((100 / maxPage) * page);
    const percentage = num.toString() + '%';
    return {
      num,
      percentage
    }
  }

  return (
    <div>
      { renderHeader(page) }
      { renderSection(page) }
      <NavBtnWrapper>
        { page > 1 && page < maxPage ? <StyledButton onClick={() => handlePageChange('prev')}>Prev</StyledButton> : null }
        { page === maxPage ? <SubmitButton>Submit</SubmitButton> : <StyledButton onClick={() => handlePageChange('next')}>Next</StyledButton> }
      </NavBtnWrapper>
    </div>
  );
}

SectionWrapperView.propTypes = {
  page: PropTypes.number.isRequired
};

export default SectionWrapperView;
