// @flow
import React from 'react';
import { Map } from 'immutable';
import { Card, CardSegment, DataGrid } from 'lattice-ui-kit';
import {
  labelMapAttributes,
  labelMapDobAlias,
  labelMapNames,
} from './constants';

type Props = {
  selectedPerson :Map;
};


const ProfileDetails = (props :Props) => {

  const { selectedPerson } = props;
  return (
    <Card>
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
    </Card>
  );
};

export default ProfileDetails;
