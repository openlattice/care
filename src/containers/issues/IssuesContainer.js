import React from 'react';
import styled from 'styled-components';
import {
  Card,
  Colors,
  Table
} from 'lattice-ui-kit';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { ISSUE_HEADERS } from './constants';

const { NEUTRALS } = Colors;

const H1 = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 30px 0;
`;

const H2 = styled.h2`
  font-size: 18px;
  font-weight: 600px;
  margin: 0;
`;

const H3 = styled.h3`
  font-size: 16px;
  font-weight: 600;
  padding: 30px 30px 0;
  margin: 0;
`;

const VerticalCard = styled(Card)`
  flex-direction: row;
`;

const Aside = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-right: 1px solid ${NEUTRALS[4]};
`;

const Main = styled.div`
  display: flex;
  flex: 3;
  flex-direction: column;
  padding: 30px;
`;

const IssuesContainer = () => {
  
  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <H1>Issues</H1>
        <VerticalCard>
          <Aside>
            <H3>Views</H3>
          </Aside>
          <Main>
            <H2>My Open Issues</H2>
            <Table
                data={[]}
                headers={ISSUE_HEADERS}
                rowsPerPageOptions={[10, 25, 50]}
                paginated />
          </Main>
        </VerticalCard>
      </ContentWrapper>
    </ContentOuterWrapper>
  )
}

export default IssuesContainer;
