// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
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

  renderDetails = () => {
    const { selectedPerson } = this.props;
    return (
      <>
        <CardSegment>
          <DataGrid
              columns={3}
              data={selectedPerson}
              labelMap={labelMapNames} />
        </CardSegment>
        <CardSegment>
          <DataGrid
              columns={3}
              data={selectedPerson}
              labelMap={labelMapDobAlias} />
        </CardSegment>
        <CardSegment>
          <DataGrid
              columns={3}
              data={selectedPerson}
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
