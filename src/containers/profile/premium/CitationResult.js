// @flow
import React from 'react';

import { List, Map } from 'immutable';
import { useSelector } from 'react-redux';

import Citation from '../../explore/Citation';
import { getEntityKeyId } from '../../../utils/DataUtils';

type Props = {
  result :Map;
};

const CitationResult = ({ result } :Props) => {
  const entityKeyId = getEntityKeyId(result);
  const people = useSelector((store) => store.getIn(['profile', 'citations', 'people', entityKeyId], List()));
  const employees = useSelector((store) => {
    const employeesByHitEKID = store.getIn(['profile', 'citations', 'employeesByHitEKID', entityKeyId], List());
    return employeesByHitEKID
      .map((employeesEKID) => store.getIn(['profile', 'citations', 'employeesByEKID', employeesEKID], Map()));
  });

  return <Citation employees={employees} people={people} result={result} />;
};

export default CitationResult;
