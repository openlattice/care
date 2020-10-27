// @flow
import React from 'react';

import { List, Map } from 'immutable';
import { useSelector } from 'react-redux';

import Citation from './Citation';

import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getEntityKeyId } from '../../utils/DataUtils';

const { CITATION_FQN } = APP_TYPES_FQNS;

type Props = {
  result :Map;
};

const CitationResult = ({ result } :Props) => {
  const entityKeyId = getEntityKeyId(result);
  const people = useSelector((store) => store.getIn(['explore', CITATION_FQN, 'people', entityKeyId], List()));
  const employees = useSelector((store) => {
    const employeesByHitEKID = store.getIn(['explore', CITATION_FQN, 'employeesByHitEKID', entityKeyId], List());
    return employeesByHitEKID
      .map((employeesEKID) => store.getIn(['explore', CITATION_FQN, 'employeesByEKID', employeesEKID], Map()));
  });

  return <Citation employees={employees} people={people} result={result} />;
};

export default CitationResult;
