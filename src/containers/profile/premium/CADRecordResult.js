// @flow
import React from 'react';

import { List, Map } from 'immutable';
import { useSelector } from 'react-redux';

import PoliceCAD from '../../explore/PoliceCAD';
import { getEntityKeyId } from '../../../utils/DataUtils';

type Props = {
  result :Map;
};

const CADRecordResult = ({ result } :Props) => {
  const entityKeyId = getEntityKeyId(result);
  const people = useSelector((store) => store.getIn(['profile', 'policeCAD', 'people', entityKeyId], List()));

  return <PoliceCAD result={result} people={people} />;
};

export default CADRecordResult;
