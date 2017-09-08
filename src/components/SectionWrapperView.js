/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';
import { Button, ProgressBar } from 'react-bootstrap';
import { Redirect, Route, Switch } from 'react-router-dom';

import ReportInfoView from '../components/ReportInfoView';
import ConsumerSearch from '../containers/ConsumerSearch';
import ConsumerInfoView from '../components/ConsumerInfoView';
import ComplainantInfoView from '../components/ComplainantInfoView';
import DispositionView from '../components/DispositionView';
import OfficerInfoView from '../components/OfficerInfoView';
import TestView from '../components/TestView';
import { SubmitButton } from '../shared/Layout';
import * as RoutePaths from '../core/router/RoutePaths';


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

class SectionWrapperView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: window.location.hash.substr(2)
    }
  }

  componentDidMount() {
    console.log('current pAGE:', this.state.page);
  }
    
  renderHeader = (page) => {
    switch(page) {
      case 1:
        return <Header>Report Information</Header>;
      case 2:
        return <Header>Select Consumer</Header>
      case 3:
        return <Header>Consumer Information</Header>;
      case 4:
        return <Header>Complainant Information</Header>;
      case 5:
        return <Header>Disposition Information</Header>;
      case 6:
        return <Header>Officer Information</Header>;
      default:
        return;
    }
  }

  getReportInfoView = () => {
    return (
      <ReportInfoView
          handleTextInput={this.props.handleTextInput}
          handleDateInput={this.props.handleDateInput}
          handleTimeInput={this.props.handleTimeInput}
          handleSingleSelection={this.props.handleSingleSelection}
          input={this.props.input.reportInfo}
          section='reportInfo' />
    );
  }

  getConsumerSearchView = () => {
    return (
      <ConsumerSearch
          handlePersonSelection={this.props.handlePersonSelection}
          handlePageChange={this.props.handlePageChange}
          personEntitySetId={this.props.personEntitySetId} />
    );
  }

  getConsumerInfoView = () => {
    return (
      <ConsumerInfoView
          handleTextInput={this.props.handleTextInput}
          handleDateInput={this.props.handleDateInput}
          handleSingleSelection={this.props.handleSingleSelection}
          handleCheckboxChange={this.props.handleCheckboxChange}
          input={this.props.input.consumerInfo}
          consumerIsSelected={this.props.input.consumerIsSelected}
          section='consumerInfo' />
    );
  }

  getComplainantInfoView = () => {
    return (
      <ComplainantInfoView
          handleTextInput={this.props.handleTextInput}
          input={this.props.input.complainantInfo}
          section='complainantInfo' />
    );
  }

  getDispositionView = () => {
    return (
      <DispositionView
          handleTextInput={this.props.handleTextInput}
          handleCheckboxChange={this.props.handleCheckboxChange}
          handleSingleSelection={this.props.handleSingleSelection}
          input={this.props.input.dispositionInfo}
          section='dispositionInfo' />
    );
  }

  getOfficerInfoView = () => {
    return (
      <OfficerInfoView
          handleTextInput={this.props.handleTextInput}
          handleCheckboxChange={this.props.handleCheckboxChange}
          input={this.props.input.officerInfo}
          section='officerInfo' />
    );
  }

// this is fucked
  getProgress = () => {
    const num = Math.ceil((100 / this.props.maxPage) * (this.state.page - 1));
    const percentage = num.toString() + '%';
    return {
      num,
      percentage
    }
  }

  render () {
   return (
     <div>
       { this.renderHeader(this.state.page) }
       <Switch>
         <Route path="/1" render={this.getReportInfoView} />
         <Route path="/2" render={this.getConsumerSearchView} />
         <Route path="/3" render={this.getConsumerInfoView} />
         <Route path="/4" render={this.getComplainantInfoView} />
         <Route path="/5" render={this.getDispositionView} />
         <Route path="/6" render={this.getOfficerInfoView} />
         <Redirect to="/1" />
       </Switch>
       <NavBtnWrapper> 
         { this.state.page > 1 && this.state.page < this.props.maxPage ? <StyledButton onClick={() => this.props.handlePageChange('prev')}>Prev</StyledButton> : null }
         { this.state.page === this.props.maxPage ? <SubmitButton>Submit</SubmitButton> : <StyledButton onClick={() => this.props.handlePageChange('next')}>Next</StyledButton> }
       </NavBtnWrapper>
     </div>
   ); 
 }
}
// const SectionWrapperView = ({
//   handleTextInput,
//   handleDateInput,
//   handleTimeInput,
//   handleSingleSelection,
//   handleCheckboxChange,
//   handlePersonSelection,
//   personEntitySetId,
//   input,
//   maxPage,
//   handlePageChange,
//   page,
//   getPage,
//   ...props
// }) => {

//   const renderHeader = (page) => {
//     switch(page) {
//       case 1:
//         return <Header>Report Information</Header>;
//       case 2:
//         return <Header>Select Consumer</Header>
//       case 3:
//         return <Header>Consumer Information</Header>;
//       case 4:
//         return <Header>Complainant Information</Header>;
//       case 5:
//         return <Header>Disposition Information</Header>;
//       case 6:
//         return <Header>Officer Information</Header>;
//       default:
//         return;
//     }
//   }

//   const getReportInfoView = () => {
//     return (
//       <ReportInfoView
//           handleTextInput={handleTextInput}
//           handleDateInput={handleDateInput}
//           handleTimeInput={handleTimeInput}
//           handleSingleSelection={handleSingleSelection}
//           input={input.reportInfo}
//           section='reportInfo' />
//     );
//   }

//   const getConsumerSearchView = () => {
//     return (
//       <ConsumerSearch
//           handlePersonSelection={handlePersonSelection}
//           handlePageChange={handlePageChange}
//           personEntitySetId={personEntitySetId} />
//     );
//   }

//   const getConsumerInfoView = () => {
//     return (
//       <ConsumerInfoView
//           handleTextInput={handleTextInput}
//           handleDateInput={handleDateInput}
//           handleSingleSelection={handleSingleSelection}
//           handleCheckboxChange={handleCheckboxChange}
//           input={input.consumerInfo}
//           consumerIsSelected={input.consumerIsSelected}
//           section='consumerInfo' />
//     );
//   }

//   const getComplainantInfoView = () => {
//     return (
//       <ComplainantInfoView
//           handleTextInput={handleTextInput}
//           input={input.complainantInfo}
//           section='complainantInfo' />
//     );
//   }

//   const getDispositionView = () => {
//     return (
//       <DispositionView
//           handleTextInput={handleTextInput}
//           handleCheckboxChange={handleCheckboxChange}
//           handleSingleSelection={handleSingleSelection}
//           input={input.dispositionInfo}
//           section='dispositionInfo' />
//     );
//   }

//   const getOfficerInfoView = () => {
//     return (
//       <OfficerInfoView
//           handleTextInput={handleTextInput}
//           handleCheckboxChange={handleCheckboxChange}
//           input={input.officerInfo}
//           section='officerInfo' />
//     );
//   }

// // this is fucked
//   const getProgress = () => {
//     const num = Math.ceil((100 / maxPage) * (page - 1));
//     const percentage = num.toString() + '%';
//     return {
//       num,
//       percentage
//     }
//   }

//   return (
//     <div>
//       { renderHeader(2) }
//       <Switch>
//         <Route path="/1" render={getReportInfoView} />
//         <Route path="/2" render={getConsumerSearchView} />
//         <Route path="/3" render={getConsumerInfoView} />
//         <Route path="/4" render={getComplainantInfoView} />
//         <Route path="/5" render={getDispositionView} />
//         <Route path="/6" render={getOfficerInfoView} />
//         <Redirect to="/1" />
//       </Switch>
//       <NavBtnWrapper> 
//         { page > 1 && page < maxPage ? <StyledButton onClick={() => handlePageChange('prev')}>Prev</StyledButton> : null }
//         { page === maxPage ? <SubmitButton>Submit</SubmitButton> : <StyledButton onClick={() => handlePageChange('next')}>Next</StyledButton> }
//       </NavBtnWrapper>
//     </div>
//   );
// }

// SectionWrapperView.propTypes = {
// };

export default SectionWrapperView;
