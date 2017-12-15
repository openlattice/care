import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';

import ConsumerSearchContainer from './followup/ConsumerSearchContainer';
import { SectionHeader } from '../shared/Layout';

const StyledButton = styled(Button)`
  margin-bottom: 20px;
`;

const DividerStatement = styled.div`
  text-align: center;
  font-size: 20px;
  margin-bottom: 20px;
`;

/*
 * TODO: this file needs to go away
 */

class ConsumerSearch extends React.Component {

  static propTypes = {
    personEntitySetId: PropTypes.string.isRequired,
    handlePersonSelection: PropTypes.func.isRequired
  }

  handleOnSelectConsumerSearchResult = (searchResult) => {

    this.props.handlePersonSelection(searchResult.toJS());
  }

  render() {
    return (
      <div>
        <SectionHeader>Select Consumer</SectionHeader>
        <StyledButton
            onClick={() => {
              // this is hacky and terrible
              this.props.handlePersonSelection(null);
            }}
            block>
          Create New Consumer Entry
        </StyledButton>
        <DividerStatement>—OR—</DividerStatement>
        <ConsumerSearchContainer
            peopleEntitySetId={this.props.personEntitySetId}
            showTitle={false}
            onSelectSearchResult={this.handleOnSelectConsumerSearchResult} />
      </div>
    );
  }
}

export default ConsumerSearch;
