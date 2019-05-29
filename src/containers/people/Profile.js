// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import {
  Banner,
  Card,
  CardSegment,
  CardStack,
  SearchResults
} from 'lattice-ui-kit';

import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import { ContentWrapper, ContentOuterWrapper } from '../../components/layout';
import { editPerson } from './PeopleActions';

const Aside = styled.div`
`;

const Main = styled.div`
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 20px;
`;

type Props = {
  actions :{
    editPerson :RequestSequence;
  };
  fetchState :RequestState;
  editState :RequestState;
};

class Profile extends Component<Props> {
  componentDidMount() {

  }

  render() {
    return (
      <ContentOuterWrapper>
        <Banner isOpen>
          NAME
        </Banner>
        <ContentWrapper>
          <ProfileGrid>
            <Aside>
              aside
            </Aside>
            <Main>
              <CardStack>
                <Card>
                  <CardSegment>
                    NAME
                  </CardSegment>
                  <CardSegment>
                    DOB
                  </CardSegment>
                  <CardSegment>
                    DEETS
                  </CardSegment>
                </Card>
                <SearchResults />
              </CardStack>
            </Main>
          </ProfileGrid>
        </ContentWrapper>
      </ContentOuterWrapper>
    );
  }
}

const mapStateToProps = state => ({
  selectedPerson: state.getIn(['profile', 'selectedPerson'], Map()),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    editPerson
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
