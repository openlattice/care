/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { faUserCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Button,
  Card,
  Label,
  Search
} from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';

import {
  IMAGE_DATA_FQN,
  PERSON_DOB_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
} from '../../edm/DataModelFqns';
import { getEntityKeyId } from '../../utils/DataUtils';
import { DOCUMENTS } from '../../utils/constants/StateConstants';
import { searchPeople } from '../people/PeopleActions';

const { formatAsDate } = DateTimeUtils;

type Props = {
  actions :{
    loadUsedTags :Function;
    searchPeople :Function;
    uploadDocuments :Function;
  };
  hasSearched :boolean;
  isLoading :boolean;
  onAdd :Function;
  onRemove :Function;
  profilePics :Map;
  searchResults :List;
  selectedPeople :Map;
};

type State = {
  tags :Set<string>,
  files :Object[]
};

export const DownloadsWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const FormWrapper = styled.div`
  align-items: center;
  background: #fff;
  border: solid 1px #e1e1eb;
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 30px 0;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  margin-bottom: 15px;
  border-collapse: collapse;
`;

const HeaderRow = styled.tr`
  background-color: #f0f0f7;
  border: 1px solid #f0f0f7;
`;

const HeaderElement = styled.th`
  font-size: 12px;
  font-weight: 600;
  color: #8e929b;
  text-transform: uppercase;
  padding: 12px 0;
  text-align: left;

  &:first-child {
    width: 100px;
  }
`;

const Cell = styled.td`
  padding: 7px 0;
  font-family: 'Open Sans', sans-serif;
  font-size: ${(props) => (props.small ? 12 : 14)}px;
`;

export const PersonPicture = styled.img`
  height: 36px;
  object-fit: cover;
  object-position: 50% 50%;
  width: 36px;
`;

const StyledPersonMugshot = styled.div`
  font-size: 12px;
  margin-right: 20px;
  border-radius: 50%;
  min-width: 36px;
  height: 36px;
  width: ${(props) => (props.small ? 30 : 36)}px;
  position: relative;
  overflow: hidden;

  img {
    display: inline;
    margin: 0 auto;
  }

  ${(props) => (props.small
    ? (
      `min-width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;`
    )
    : ''
  )}
`;

const Row = styled.tr`
  padding: 7px 30px;
  border-bottom: 1px solid #e1e1eb;
  border-left: 1px solid #e1e1eb;
  border-right: 1px solid #e1e1eb;

  td {
    color: #2e2e34;
  }

  td:first-child {
    padding-left: 30px;
  }

  td:last-child {
    padding-right: 30px;
  }

  &:hover {
    cursor: pointer;
    background: #f8f8fc;
  }

  &:active {
    background-color: #e4d8ff;
  }

  background-color: ${(props) => (props.active ? '#e4d8ff' : 'none')};
`;

const NoResults = styled.div`
  color: #555e6f;
  font-size: 16px;
  text-align: center;
  width: 100%;
  padding: 10px 0;
`;

const SelectedPersonCard = styled(Card)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
  padding: 15px 30px;

  article {
    display: flex;
    flex-direction: column;
    padding: 0 15px;
  }
`;

const Headers = () => (
  <HeaderRow>
    <HeaderElement />
    <HeaderElement>Last Name</HeaderElement>
    <HeaderElement>First Name</HeaderElement>
    <HeaderElement>Middle Name</HeaderElement>
    <HeaderElement>Date Of Birth</HeaderElement>
  </HeaderRow>
);

class PeopleSelection extends React.Component<Props, State> {

  onSearch = (searchFields :Map) => {
    const { actions } = this.props;

    const searchInputs = Map()
      .set('firstName', searchFields.get('firstname'))
      .set('lastName', searchFields.get('lastname'))
      .set('dob', searchFields.get('dob'));

    actions.searchPeople({ searchInputs, maxHits: 10 });
  }

  formatValue = (rawValue :string | List) :string => {
    if (!rawValue || (!rawValue.length && !rawValue.size)) return '';
    if (typeof rawValue === 'string') {
      return rawValue || '';
    }
    return rawValue.join(', ');
  }

  formatDateList = (dateList :List) :string => {
    if (!dateList || (!dateList.length && !dateList.size)) return '';
    return dateList.map((dateString) => formatAsDate(dateString, dateString)).join(', ');
  }

  renderPersonPicture = (person :Map) => {
    const { profilePics } = this.props;
    const personEKID = getEntityKeyId(person);
    const picture = profilePics.getIn([personEKID, IMAGE_DATA_FQN, 0]);
    return picture
      ? (
        <StyledPersonMugshot>
          <PersonPicture src={picture} alt="" />
        </StyledPersonMugshot>
      ) : (
        <StyledPersonMugshot>
          <FontAwesomeIcon icon={faUserCircle} size="3x" />
        </StyledPersonMugshot>
      );
  }

  renderSelectedPeople = () => {
    const { onRemove, selectedPeople } = this.props;

    return selectedPeople.entrySeq().map(([entityKeyId, person]) => {
      const firstName = this.formatValue(person.get(PERSON_FIRST_NAME_FQN, List()));
      const middleName = this.formatValue(person.get(PERSON_MIDDLE_NAME_FQN, List()));
      const lastName = this.formatValue(person.get(PERSON_LAST_NAME_FQN, List()));
      const dob = this.formatDateList(person.get(PERSON_DOB_FQN, List()));

      const onDeletePerson = () => onRemove(entityKeyId);

      return (
        <SelectedPersonCard key={entityKeyId}>
          {this.renderPersonPicture(person)}
          <article>
            <Label subtle>Last Name</Label>
            <div>{lastName}</div>
          </article>
          <article>
            <Label subtle>First Name</Label>
            <div>{firstName}</div>
          </article>
          <article>
            <Label subtle>Middle Name</Label>
            <div>{middleName}</div>
          </article>
          <article>
            <Label subtle>Date of Birth</Label>
            <div>{dob}</div>
          </article>
          <Button onClick={onDeletePerson}>Remove</Button>
        </SelectedPersonCard>
      );
    });
  }

  renderSearchResults = () => {
    const {
      hasSearched,
      isLoading,
      onAdd,
      searchResults,
      selectedPeople,
    } = this.props;

    if (!hasSearched || isLoading) {
      return null;
    }

    const searchResultRows = searchResults
      .map((person) => [getEntityKeyId(person), person])
      .filter(([entityKeyId]) => !selectedPeople.has(entityKeyId))
      .map((([entityKeyId, person]) => {
        const picture = this.renderPersonPicture(person);

        const firstName = this.formatValue(person.get(PERSON_FIRST_NAME_FQN, List()));
        const middleName = this.formatValue(person.get(PERSON_MIDDLE_NAME_FQN, List()));
        const lastName = this.formatValue(person.get(PERSON_LAST_NAME_FQN, List()));
        const dob = this.formatDateList(person.get(PERSON_DOB_FQN, List()));

        return (
          <Row key={entityKeyId} onClick={() => onAdd(entityKeyId, person)}>
            <Cell>{ picture }</Cell>
            <Cell>{ lastName }</Cell>
            <Cell>{ firstName }</Cell>
            <Cell>{ middleName }</Cell>
            <Cell>{ dob }</Cell>
          </Row>
        );
      }));

    return (
      <>
        <Table>
          <tbody>
            <Headers />
            {searchResultRows}
          </tbody>
        </Table>
        {searchResultRows.size ? null : <NoResults>No Results</NoResults> }
      </>
    );

  }

  render() {
    const { isLoading } = this.props;
    return (
      <div>
        {this.renderSelectedPeople()}
        <Search onSearch={this.onSearch} isLoading={isLoading} />
        {this.renderSearchResults()}
      </div>
    );
  }
}

const mapStateToProps = (state :Map) => ({
  downloading: state.getIn(['downloads', 'downloading']),
  hasSearched: state.getIn(['people', 'fetchState']) !== RequestStates.STANDBY,
  isLoading: state.getIn(['people', 'fetchState']) === RequestStates.PENDING,
  profilePics: state.getIn(['people', 'profilePicsByEKID']),
  searchResults: state.getIn(['people', 'hits']),
  tags: state.getIn(['documents', DOCUMENTS.TAGS]),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    searchPeople
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(PeopleSelection);
