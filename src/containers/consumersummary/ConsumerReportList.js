import React from 'react';
import styled from 'styled-components';


const ListContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

// create separate component or reuse existing
const ListItem = styled.div`
  background: yellow;
  display: flex;
  margin: 10px 0;
  padding: 10px 30px;
  width: 100%;
`;

// pass info
const ReportListItem = ({ id, name, date, handleOnSelectReport }) => (
  <ListItem handleOnSelectReport={handleOnSelectReport}>
    blah blah report info
  </ListItem>
);


const ConsumerReportList = ({ reports, handleOnSelectReport }) => {
  const getListItems = () => reports.map(id => <ReportListItem handleOnSelectReport={handleOnSelectReport} />);

  return (
    <ListContainer>
      { getListItems() }
    </ListContainer>
  );
};

export default ConsumerReportList;
