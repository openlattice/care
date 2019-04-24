// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { OrderedMap } from 'immutable';

import SearchableSelect from '../../../components/controls/SearchableSelect';
import {
  FormWrapper,
  FormSection,
  Header
} from '../../../components/crisis/FormComponents';
import SecondaryButton from '../../../components/buttons/SecondaryButton';

const StyledFormWrapper = styled(FormWrapper)`
  margin-bottom: 30px;
`;

const CreateNewPersonButton = styled(SecondaryButton)`
  padding: 12px 20px;
  width: fit-content;
  align-self: flex-end;
`;

type Props = {
  handleChange :() => void;
  handleClick :() => void;
  handleSelect :() => void;
  isLoadingResults :boolean;
  noResults :boolean;
  value :string;
  options :OrderedMap;
}

class SubjectQuickSearch extends Component<Props> {

  componentDidMount() {}

  render() {
    const {
      value,
      handleClick,
      handleChange,
      handleSelect,
      isLoadingResults,
      noResults,
      options,
    } = this.props;

    return (
      <StyledFormWrapper>
        <FormSection>
          <CreateNewPersonButton onClick={handleClick}>Create New Person</CreateNewPersonButton>
          <Header>
            <h1>Quick Search</h1>
            <span>
              {'Search by last name, first name, or alias. No results? Click "Create New Person" above'}
            </span>
          </Header>
          <SearchableSelect
              value={value}
              onInputChange={handleChange}
              onSelect={handleSelect}
              options={options}
              isLoadingResults={isLoadingResults}
              noResults={noResults}
              transparent
              searchIcon
              fullWidth
              dropdownIcon={false}
              split
              noFilter
              withBorders
              short />
        </FormSection>
      </StyledFormWrapper>
    );
  }
}

export default SubjectQuickSearch;
