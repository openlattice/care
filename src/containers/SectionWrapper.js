/*
 * @flow
 */

import React from 'react';

import SectionWrapperView from '../components/SectionWrapperView';

class SectionWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.page !== nextProps.page) {
      window.scrollTo(0,0);
    }
  }

  render() {
    return(
      <SectionWrapperView
          handleTextInput={this.props.handleTextInput}
          handleDateInput={this.props.handleDateInput}
          handleTimeInput={this.props.handleTimeInput}
          handleSingleSelection={this.props.handleSingleSelection}
          handleCheckboxChange={this.props.handleCheckboxChange}
          input={this.props.input}
          page={this.props.page}
          maxPage={this.props.maxPage}
          handlePageChange={this.props.handlePageChange} />    );
  }
}

export default SectionWrapper;
