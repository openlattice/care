import React from 'react';
import styled from 'styled-components';
import { Button } from 'lattice-ui-kit';

import ConsumerSearchContainer from './followup/ConsumerSearchContainer';
import { FormGridWrapper, FullWidthItem } from '../components/form/StyledFormComponents';

const CreateButton = styled(Button)`
  width: 100%;
`;

const DividerStatement = styled.div`
  font-size: 16px;
  text-align: center;
`;

/*
 * TODO: this file needs to go away
 */

class ConsumerSearch extends React.Component {

  handleOnSelectConsumerSearchResult = (searchResult) => {

    const { handlePersonSelection } = this.props;
    handlePersonSelection(searchResult.toJS());
  }

  render() {

    const { handlePersonSelection, personEntitySetId } = this.props;
    return (
      <FormGridWrapper>
        <FullWidthItem>
          <h1>Select Consumer</h1>
        </FullWidthItem>
        <FullWidthItem>
          <CreateButton
              mode="secondary"
              onClick={() => {
                // this is hacky and terrible
                handlePersonSelection(null);
              }}>
            Create New Consumer Entry
          </CreateButton>
        </FullWidthItem>
        <FullWidthItem>
          <DividerStatement>— OR —</DividerStatement>
        </FullWidthItem>
        <FullWidthItem>
          <ConsumerSearchContainer
              peopleEntitySetId={personEntitySetId}
              showTitle={false}
              onSelectSearchResult={this.handleOnSelectConsumerSearchResult} />
        </FullWidthItem>
      </FormGridWrapper>
    );
  }
}

export default ConsumerSearch;
