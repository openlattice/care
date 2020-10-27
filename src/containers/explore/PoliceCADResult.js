// @flow
import React from 'react';

import { List, Map } from 'immutable';
import { useSelector } from 'react-redux';

import PoliceCAD from './PoliceCAD';

import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getEntityKeyId } from '../../utils/DataUtils';

const { POLICE_CAD_FQN } = APP_TYPES_FQNS;

type Props = {
  result :Map;
};

const PoliceCADResult = ({ result } :Props) => {
  const entityKeyId = getEntityKeyId(result);
  const people = useSelector((store) => store.getIn(['explore', POLICE_CAD_FQN, 'people', entityKeyId], List()));

  return <PoliceCAD result={result} people={people} />;
};

export default PoliceCADResult;
