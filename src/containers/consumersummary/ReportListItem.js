import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Immutable } from 'immutable-js';


const ListItem = styled.div`
  background: yellow;
  display: flex;
  margin: 10px 0;
  padding: 10px 30px;
  width: 100%;
  height: 20px;
`;

// pass info
const ReportListItem = ({ report, handleOnSelectReport }) => {
  if (Immutable.Iterable.isIterable(report)) {
    report = report.toJS();
  }

  console.log('report:', report);

  return (
    <ListItem onClick={handleOnSelectReport}>
      { report.get('bhr.dateOccurred') }
    </ListItem>
  );
} ;

export default ReportListItem;
