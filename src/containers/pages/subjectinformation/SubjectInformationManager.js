// @flow
import React, { Component } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { List, Map, OrderedMap } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';

import SubjectQuickSearch from './SubjectQuickSearch';
import SubjectInformation from './SubjectInformation';
import { getPeopleESId } from '../../../utils/AppUtils';
import { SUBJECT_INFORMATION } from '../../../utils/constants/CrisisTemplateConstants';
import { STATE } from '../../../utils/constants/StateConstants';
import {
  PERSON_DOB_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
  PERSON_NICK_NAME_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN,
  PERSON_ID_FQN
} from '../../../edm/DataModelFqns';
import { searchConsumers } from '../../search/SearchActionFactory';
import { setInputValue, setInputValues } from './ActionFactory';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

type Props = {
  actions :{
    searchConsumers :RequestSequence;
    setInputValue :RequestSequence;
    setInputValues :RequestSequence;
  };
  app :Map;
  isSearchingPeople :boolean;
  noResults :boolean;
  searchResults :List;
  values :Map;
};

class SubjectInformationManager extends Component<Props> {

  searchTimeout = null;

  handleFullNameChange = (e :SyntheticEvent) => {
    const { actions, app } = this.props;
    const { value } = e.target;

    actions.setInputValue({
      field: SUBJECT_INFORMATION.FULL_NAME,
      value
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

  formatPersonName = (person :Map) => {
    const firstName = person.getIn([PERSON_FIRST_NAME_FQN, 0], '');
    const lastName = person.getIn([PERSON_LAST_NAME_FQN, 0], '');
    const middleName = person.getIn([PERSON_MIDDLE_NAME_FQN, 0], '');
    return `${lastName}, ${firstName} ${middleName}`;
  }

  getPersonOptions = () => {
    const { searchResults } = this.props;
    let options = OrderedMap();
    searchResults.forEach((person) => {
      const dobStr = person.getIn([PERSON_DOB_FQN, 0], '');
      const dobMoment = moment(dobStr);

      const dob = dobMoment.isValid() ? dobMoment.format('MM-DD-YYYY') : dobStr;

      options = options.set(List.of(this.formatPersonName(person), dob), person);
    });

    return options;
  }

  toggleNewPerson = (event :SyntheticEvent) => {
    const { actions } = this.props;
    event.preventDefault();
    actions.setInputValue({
      field: SUBJECT_INFORMATION.IS_NEW_PERSON,
      value: true
    });
  };

  selectPerson = (person :Map) => {
    const { actions } = this.props;

    actions.setInputValues({
      [SUBJECT_INFORMATION.PERSON_ID]: person.getIn([PERSON_ID_FQN, 0], ''),
      [SUBJECT_INFORMATION.FULL_NAME]: this.formatPersonName(person),
      [SUBJECT_INFORMATION.FIRST]: person.getIn([PERSON_FIRST_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.LAST]: person.getIn([PERSON_LAST_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.MIDDLE]: person.getIn([PERSON_MIDDLE_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.AKA]: person.getIn([PERSON_NICK_NAME_FQN, 0], ''),
      [SUBJECT_INFORMATION.DOB]: person.getIn([PERSON_DOB_FQN, 0], ''),
      [SUBJECT_INFORMATION.RACE]: person.getIn([PERSON_RACE_FQN, 0], ''),
      [SUBJECT_INFORMATION.GENDER]: person.getIn([PERSON_SEX_FQN, 0], ''),
      [SUBJECT_INFORMATION.AGE]: moment().diff(moment(person.getIn([PERSON_DOB_FQN, 0], '')), 'years'),
      [SUBJECT_INFORMATION.SSN_LAST_4]: 'XXXX',
      [SUBJECT_INFORMATION.IS_NEW_PERSON]: false
    });
  }

  render() {
    const {
      isSearchingPeople,
      values,
      noResults
    } = this.props;
    return (
      <Wrapper>
        <SubjectQuickSearch
            value={values.get(SUBJECT_INFORMATION.FULL_NAME)}
            options={this.getPersonOptions()}
            handleChange={this.handleFullNameChange}
            handleClick={this.toggleNewPerson}
            handleSelect={this.selectPerson}
            noResults={noResults}
            isLoadingResults={isSearchingPeople} />
        <SubjectInformation />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => {

  const consumers = state.getIn(['search', 'consumers'], Map());
  const searchResults = consumers.get('searchResults', List());

  return {
    app: state.get('app', Map()),
    values: state.get(STATE.SUBJECT_INFORMATION),
    searchResults,
    isSearchingPeople: consumers.get('isSearching', false),
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
export default connect(mapStateToProps, mapDispatchToProps)(SubjectInformationManager);
