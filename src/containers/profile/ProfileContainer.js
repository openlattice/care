// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import {
  CardStack,
  SearchResults
} from 'lattice-ui-kit';
import { faPortrait } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import { ContentWrapper, ContentOuterWrapper } from '../../components/layout';
import { editPerson } from './ProfileActions';
import ProfileBanner from './ProfileBanner';
import ProfileDetails from './ProfileDetails';

// Fixed placeholder size
const PlaceholderPortrait = styled(FontAwesomeIcon)`
  height: 265px !important;
  width: 200px !important;
`;

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
  selectedPerson :Map;
};

class ProfileContainer extends Component<Props> {
  componentDidMount() {

  }

  render() {
    const { selectedPerson } = this.props;
    return (
      <ContentOuterWrapper>
        <ProfileBanner selectedPerson={selectedPerson} />
        <ContentWrapper>
          <ProfileGrid>
            <Aside>
              <PlaceholderPortrait icon={faPortrait} />
            </Aside>
            <Main>
              <CardStack>
                <ProfileDetails selectedPerson={selectedPerson} />
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
export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
