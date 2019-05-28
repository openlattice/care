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
          <CardStack>
            <Card>
              <CardSegment>
                Testing
              </CardSegment>
            </Card>
            <SearchResults />
          </CardStack>
        </ContentWrapper>
      </ContentOuterWrapper>
    );
  }
}

const mapStateToProps = state => ({
  selectedPerson: state.getIn(['people', 'selectedPerson'], Map()),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    editPerson
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
