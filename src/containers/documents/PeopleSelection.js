/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { faUserCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import { Constants } from 'lattice';
import { Button, Card, Search } from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';

import {
  PERSON_DOB_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
  PERSON_PICTURE_FQN,
} from '../../edm/DataModelFqns';
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
  onAdd :Function;
  onRemove :Function;
  searchResults :List;
  selectedPeople :Map;
};

type State = {
  tags :Set<string>,
  files :Object[]
};

const { OPENLATTICE_ID_FQN } = Constants;
const DATE_FORMAT = 'MM/dd/yyyy';

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
  font-size: 11px;
  font-weight: 600;
  font-family: 'Open Sans', sans-serif;
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
  width: ${(props) => (props.small ? 30 : 36)}px;
  height: auto;
`;

const StyledPersonMugshot = styled.div`
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
  padding: 15px 40px;
  margin-bottom: 7px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  article {
    display: flex;
    flex-direction: column !important;
    padding: 0 15px;

    span {
      display: inline-block;
      margin: 5px 5px 5px 0;
      color: rgb(139, 139, 144);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    div {
      color: #1f1f22;
      line-height: 1.5;
      min-height: 24px;
    }
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

  onSearch = (searchFields) => {
    const { actions } = this.props;

    const searchInputs = Map()
      .set('firstName', searchFields.get('firstname'))
      .set('lastName', searchFields.get('lastname'))
      .set('dob', searchFields.get('dob'));

    actions.searchPeople({ searchInputs, maxHits: 10 });
  }

  formatValue = (rawValue :string | string[]) :string => {
    if (!rawValue || (!rawValue.length && !rawValue.size)) return '';
    if (typeof rawValue === 'string') {
      return rawValue || '';
    }
    return rawValue.join(', ');
  }

  formatDateList = (dateList :string[]) :string => {
    if (!dateList || (!dateList.length && !dateList.size)) return '';
    return dateList.map((dateString) => formatAsDate(dateString, dateString)).join(', ');
  }

  renderPersonPicture = (person) => {
    const picture :string = person.getIn([PERSON_PICTURE_FQN, 0]);
    return picture
      ? (
        <StyledPersonMugshot>
          <PersonPicture src={picture} alt="" />
        </StyledPersonMugshot>
      ) : <FontAwesomeIcon icon={faUserCircle} size="2x" />;
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
            <span>Last Name</span>
            <div>{lastName}</div>
          </article>
          <article>
            <span>First Name</span>
            <div>{firstName}</div>
          </article>
          <article>
            <span>Middle Name</span>
            <div>{middleName}</div>
          </article>
          <article>
            <span>Date of Birth</span>
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
      onAdd,
      searchResults,
      selectedPeople
    } = this.props;

    if (!hasSearched) {
      return null;
    }

    const searchResultRows = searchResults
      .map((person) => [person.getIn([OPENLATTICE_ID_FQN, 0], ''), person])
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
    return (
      <div>
        {this.renderSelectedPeople()}
        <Search onSearch={this.onSearch} />
        {this.renderSearchResults()}
      </div>
    );
  }
}

const mapStateToProps = (state :Map) => ({
  downloading: state.getIn(['downloads', 'downloading']),
  tags: state.getIn(['documents', DOCUMENTS.TAGS]),
  searchResults: state.getIn(['people', 'hits']),
  hasSearched: state.getIn(['people', 'fetchState']) !== RequestStates.STANDBY
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    searchPeople
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(PeopleSelection);
