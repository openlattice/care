// @flow
import React from 'react';
import styled from 'styled-components';
import { Map } from 'immutable';
import { Card, CardSegment, DataGrid } from 'lattice-ui-kit';
import {
  labelMapAttributes,
  labelMapDobAlias,
  labelMapNames,
} from './constants';

const DataWrapper = styled.div`
  flex: 1;
`;

type Props = {
  selectedPerson :Map;
};

const ProfileDetails = (props :Props) => {

  const { selectedPerson } = props;
  return (
    <Card>
      <CardSegment>
        <DataWrapper>
          <DataGrid
              columns={3}
              data={selectedPerson}
              labelMap={labelMapNames} />
        </DataWrapper>
      </CardSegment>
      <CardSegment>
        <DataWrapper>
          <DataGrid
              columns={3}
              data={selectedPerson}
              labelMap={labelMapDobAlias} />
        </DataWrapper>
      </CardSegment>
      <CardSegment>
        <DataWrapper>
          <DataGrid
              columns={3}
              data={selectedPerson}
              labelMap={labelMapAttributes} />
        </DataWrapper>
      </CardSegment>
    </Card>
  );
};

export default ProfileDetails;
