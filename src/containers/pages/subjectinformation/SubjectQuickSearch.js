// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { List, Map, OrderedMap } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';

import SearchableSelect from '../../../components/controls/SearchableSelect';
import SecondaryButton from '../../../components/buttons/SecondaryButton';
import { getPersonOptions, formatPersonName } from './SubjectInformationManagerUtils';
import { setInputValue, setInputValues } from './ActionFactory';
import { searchConsumers } from '../../search/SearchActionFactory';
import {
  FormWrapper,
  FormSection,
  Header
} from '../../../components/crisis/FormComponents';
import { getPeopleESId } from '../../../utils/AppUtils';
import { SUBJECT_INFORMATION } from '../../../utils/constants/CrisisTemplateConstants';
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

const StyledFormWrapper = styled(FormWrapper)`
  margin-bottom: 30px;
`;

const CreateNewPersonButton = styled(SecondaryButton)`
  padding: 12px 20px;
  width: fit-content;
  align-self: flex-end;
`;

type Props = {
  actions :{
    searchConsumers :RequestSequence;
    setInputValue :RequestSequence;
    setInputValues :RequestSequence;
  };
  app :Map;
  isLoadingResults :boolean;
  noResults :boolean;
  options :OrderedMap;
}

type State = {
  searchInput :string;
}

class SubjectQuickSearch extends Component<Props, State> {

  state = {
    searchInput: ''
  }

  componentDidMount() {}

  searchTimeout = null;

  handleClick = (event :SyntheticEvent<HTMLButtonElement>) => {
    const { actions } = this.props;
    event.preventDefault();
    actions.setInputValue({
      field: SUBJECT_INFORMATION.IS_NEW_PERSON,
      value: true
    });
  };

  handleChange = (e :SyntheticInputEvent<*>) => {
    const { actions, app } = this.props;
    const { value } = e.target;

    this.setState({
      searchInput: value
    });

    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      if (value && value.length) {
        actions.searchConsumers({
          entitySetId: getPeopleESId(app),
          query: value
        });
      }
    }, 500);
  }

  handleClear = () => {
    this.setState({
      searchInput: ''
    });
  }

  handleSelect = (person :Map) => {
    const { actions } = this.props;

    actions.setInputValues({
      [SUBJECT_INFORMATION.PERSON_ID]: person.getIn([PERSON_ID_FQN, 0], ''),
      [SUBJECT_INFORMATION.FULL_NAME]: formatPersonName(person),
      [SUBJECT_INFORMATION.FIRST]: person.getIn([PERSON_FIRST_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.LAST]: person.getIn([PERSON_LAST_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.MIDDLE]: person.getIn([PERSON_MIDDLE_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.AKA]: person.getIn([PERSON_NICK_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.DOB]: person.getIn([PERSON_DOB_FQN, 0], ''),
      [SUBJECT_INFORMATION.RACE]: person.getIn([PERSON_RACE_FQN, 0], ''),
      [SUBJECT_INFORMATION.GENDER]: person.getIn([PERSON_SEX_FQN, 0], ''),
      [SUBJECT_INFORMATION.AGE]: moment().diff(moment(person.getIn([PERSON_DOB_FQN, 0], '')), 'years'),
      [SUBJECT_INFORMATION.SSN_LAST_4]: person.getIn([PERSON_SSN_LAST_4_FQN, 0], ''),
      [SUBJECT_INFORMATION.IS_NEW_PERSON]: false
    });
  }

  render() {
    const {
      isLoadingResults,
      noResults,
      options
    } = this.props;
    const { searchInput } = this.state;

    return (
      <StyledFormWrapper>
        <FormSection>
          <CreateNewPersonButton onClick={this.handleClick}>Create New Person</CreateNewPersonButton>
          <Header>
            <h1>Quick Search</h1>
            <span>
              {'Search by last name, first name, or alias. No results? Click "Create New Person" above'}
            </span>
          </Header>
          <SearchableSelect
              dropdownIcon={false}
              fullWidth
              isLoadingResults={isLoadingResults}
              noFilter
              noResults={noResults}
              onClear={this.handleClear}
              onInputChange={this.handleChange}
              onSelect={this.handleSelect}
              options={options}
              searchIcon
              short
              split
              transparent
              value={searchInput}
              withBorders />
        </FormSection>
      </StyledFormWrapper>
    );
  }
}

const mapStateToProps = (state) => {

  const consumers = state.getIn(['search', 'consumers'], Map());
  const searchResults = consumers.get('searchResults', List());
  const options = getPersonOptions(searchResults);

  return {
    app: state.get('app', Map()),
    options,
    isLoadingResults: consumers.get('isSearching', false),
    noResults: consumers.get('searchComplete', false) && searchResults.size === 0
  };
};

const mapDispatchToProps = (dispatch :Dispatch<*>) => ({
  // $FlowFixMe
  actions: bindActionCreators({
    searchConsumers,
    setInputValue,
    setInputValues,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(SubjectQuickSearch);
