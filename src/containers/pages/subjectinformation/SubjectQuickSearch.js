// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { List, Map, getIn } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Label, Select } from 'lattice-ui-kit';
import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import type { Dispatch } from 'redux';
import type { RequestSequence } from 'redux-reqseq';

import { getPersonOptions, getLastFirstMiFromPerson, getPersonAge } from '../../../utils/PersonUtils';
import { setInputValue, setInputValues } from './ActionFactory';
import { searchConsumers } from '../../search/SearchActionFactory';
import {
  FormWrapper,
  FormSection,
  Header
} from '../../../components/crisis/FormComponents';
import { getPeopleESId } from '../../../utils/AppUtils';
import { SUBJECT_INFORMATION } from '../../../utils/constants/CrisisReportConstants';
import {
  PERSON_DOB_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_ID_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
  PERSON_NICK_NAME_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN,
  PERSON_SSN_LAST_4_FQN,
} from '../../../edm/DataModelFqns';

const SEARCH_INSTRUCTIONS = 'Search by last name, first name, or alias. No results? Click "Create New Person" above';

const StyledFormWrapper = styled(FormWrapper)`
  margin-bottom: 30px;
`;

const EndButton = styled(Button)`
  margin-left: auto;
`;

type Props = {
  actions :{
    searchConsumers :RequestSequence;
    setInputValue :RequestSequence;
    setInputValues :RequestSequence;
  };
  app :Map;
  isLoadingResults :boolean;
  options :List;
  preselectedPerson :Map;
}

class SubjectQuickSearch extends Component<Props> {

  componentDidMount() {
    const { preselectedPerson } = this.props;
    if (!preselectedPerson.isEmpty()) {
      this.handleSelect({
        value: preselectedPerson
      });
    }
  }

  searchTimeout = null;

  handleClick = (event :SyntheticEvent<HTMLButtonElement>) => {
    const { actions } = this.props;
    event.preventDefault();
    actions.setInputValue({
      field: SUBJECT_INFORMATION.IS_NEW_PERSON,
      value: true
    });
  };

  handleChange = (value :string) => {
    const { actions, app } = this.props;

    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      if (value && value.length) {
        actions.searchConsumers({
          entitySetId: getPeopleESId(app),
          query: `${value}*`
        });
      }
    }, 500);
  }

  handleSelect = (option :any) => {
    const { actions } = this.props;
    if (option) {
      const { value } = option;
      const isNewPerson = getIn(value, ['isNewPerson', 0]) || false;
      const age = getPersonAge(value);

      actions.setInputValues({
        [SUBJECT_INFORMATION.PERSON_ID]: getIn(value, [PERSON_ID_FQN, 0], ''),
        [SUBJECT_INFORMATION.FULL_NAME]: getLastFirstMiFromPerson(value),
        [SUBJECT_INFORMATION.FIRST]: getIn(value, [PERSON_FIRST_NAME_FQN, 0], ''),
        [SUBJECT_INFORMATION.LAST]: getIn(value, [PERSON_LAST_NAME_FQN, 0], ''),
        [SUBJECT_INFORMATION.MIDDLE]: getIn(value, [PERSON_MIDDLE_NAME_FQN, 0], ''),
        [SUBJECT_INFORMATION.AKA]: getIn(value, [PERSON_NICK_NAME_FQN, 0], ''),
        [SUBJECT_INFORMATION.DOB]: getIn(value, [PERSON_DOB_FQN, 0], ''),
        [SUBJECT_INFORMATION.RACE]: getIn(value, [PERSON_RACE_FQN, 0], ''),
        [SUBJECT_INFORMATION.GENDER]: getIn(value, [PERSON_SEX_FQN, 0], ''),
        [SUBJECT_INFORMATION.AGE]: age,
        [SUBJECT_INFORMATION.SSN_LAST_4]: getIn(value, [PERSON_SSN_LAST_4_FQN, 0], ''),
        [SUBJECT_INFORMATION.IS_NEW_PERSON]: isNewPerson
      });
    }
  }

  render() {
    const {
      isLoadingResults,
      options,
    } = this.props;

    return (
      <StyledFormWrapper>
        <FormSection>
          <EndButton mode="secondary" onClick={this.handleClick}>Create New Person</EndButton>
          <Header>
            <h1>Quick Search</h1>
            <Label>{ SEARCH_INSTRUCTIONS }</Label>
          </Header>
          <Select
              inputId="subject-quick-search-input"
              icon={faSearch}
              isClearable
              isLoading={isLoadingResults}
              onChange={this.handleSelect}
              onInputChange={this.handleChange}
              options={options}
              placeholder="Search..." />
        </FormSection>
      </StyledFormWrapper>
    );
  }
}

const mapStateToProps = (state) => {

  const consumers = state.getIn(['search', 'consumers'], Map());
  const searchResults = consumers.get('searchResults', List());
  const options = getPersonOptions(searchResults);
  const preselectedPerson = state.getIn(['router', 'location', 'state']) || Map();

  return {
    app: state.get('app', Map()),
    isLoadingResults: consumers.get('isSearching', false),
    options,
    preselectedPerson,
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    searchConsumers,
    setInputValue,
    setInputValues,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(SubjectQuickSearch);
