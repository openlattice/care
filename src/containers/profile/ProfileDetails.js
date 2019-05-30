// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { Map } from 'immutable';
import {
  Card,
  CardSegment,
  DataGrid,
  Spinner
} from 'lattice-ui-kit';
import {
  labelMapAttributes,
  labelMapDobAlias,
  labelMapNames,
} from './constants';
import { PERSON_DOB_FQN } from '../../edm/DataModelFqns';

const Centered = styled(CardSegment)`
  align-items: center;
  display: flex;
  height: 382px;
  justify-content: center;
`;

type Props = {
  isLoading :boolean;
  selectedPerson :Map;
};

class ProfileDetails extends Component<Props> {

  renderLoading = () => (
    <Centered>
      <Spinner size="2x" />
    </Centered>
  )

  formatResult = () => {
    const { selectedPerson } = this.props;
    const rawDob :string = selectedPerson.getIn([PERSON_DOB_FQN, 0]);
    if (rawDob) {
      const formattedDob = DateTime.fromISO(rawDob).toLocaleString(DateTime.DATE_SHORT);
      return selectedPerson.setIn([PERSON_DOB_FQN.toString(), 0], formattedDob);
    }

    return selectedPerson;
  }

  renderDetails = () => {
    const formattedPerson = this.formatResult();

    return (
      <>
        <CardSegment>
          <DataGrid
              columns={3}
              data={formattedPerson}
              labelMap={labelMapNames} />
        </CardSegment>
        <CardSegment>
          <DataGrid
              columns={3}
              data={formattedPerson}
              labelMap={labelMapDobAlias} />
        </CardSegment>
        <CardSegment>
          <DataGrid
              columns={3}
              data={formattedPerson}
              labelMap={labelMapAttributes} />
        </CardSegment>
      </>
    );
  }

  render() {
    const { isLoading } = this.props;
    return (
      <Card>
        { isLoading
          ? this.renderLoading()
          : this.renderDetails()
        }
      </Card>
    );
  }
}

export default ProfileDetails;
