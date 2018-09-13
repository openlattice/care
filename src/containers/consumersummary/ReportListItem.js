import React, { Fragment } from 'react';
import styled from 'styled-components';


const ListItem = styled.div`
  background: yellow;
  display: flex;
  margin: 10px 0;
  padding: 10px 30px;
  width: 100%;
  height: 20px;
`;

// pass info
const ReportListItem = ({ report, handleOnSelectReport }) => (
  <ListItem onClick={handleOnSelectReport}>
    { report.get('bhr.dateOccurred') }
  </ListItem>
);

export default ReportListItem;
