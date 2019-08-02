// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment,
  Modal,
  Spinner,
} from 'lattice-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/pro-solid-svg-icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';

import type { RequestSequence, RequestState } from 'redux-reqseq';
import type { Dispatch } from 'redux';

import EditProfileForm from '../EditProfileForm';
import { updateProfileAbout } from '../ProfileActions';
import { reduceRequestStates } from '../../../utils/StateUtils';

const StyledCard = styled(Card)`
  margin: 0 -30px;
  border: none;
`;

const H1 = styled.h1`
  display: flex;
  flex: 1 0 auto;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  align-items: center;
`;

const UserIcon = styled(FontAwesomeIcon).attrs({
  icon: faUser
})`
  margin-right: 10px;
`;

type Props = {
  actions :{
    updateProfileAbout :RequestSequence;
  };
  fetchAboutState :RequestState;
  isVisible :boolean;
  onClose :() => void;
  physicalAppearance :Map;
  selectedPerson :Map;
  updateAboutState :RequestState;
};

class EditAboutModal extends Component<Props> {
  componentDidUpdate(prevProps :Props) {
    const { updateAboutState, onClose } = this.props;
    const { updateAboutState: prevUpdateAboutState } = prevProps;
    if (updateAboutState === RequestStates.SUCCESS
      && prevUpdateAboutState === RequestStates.PENDING) {
      onClose();
    }
  }

  renderEditProfileForm = () => {
    const {
      actions,
      fetchAboutState,
      onClose,
      physicalAppearance,
      selectedPerson,
      updateAboutState
    } = this.props;

    if (fetchAboutState === RequestStates.PENDING) {
      return (
        <CardSegment vertical>
          <Spinner size="2x" />
        </CardSegment>
      );
    }

    return (
      <EditProfileForm
          isLoading={updateAboutState === RequestStates.PENDING}
          onDiscard={onClose}
          onSubmit={actions.updateProfileAbout}
          physicalAppearance={physicalAppearance}
          selectedPerson={selectedPerson} />
    );
  }

  render() {
    const {
      isVisible,
      onClose,
    } = this.props;

    return (
      <Modal
          isVisible={isVisible}
          onClose={onClose}
          viewportScrolling
          withHeader={false}>
        <StyledCard>
          <CardHeader mode="primary" padding="sm">
            <H1>
              <UserIcon fixedWidth />
              Edit About
            </H1>
          </CardHeader>
          { this.renderEditProfileForm() }
        </StyledCard>
      </Modal>
    );
  }
}

const mapStateToProps = (state :Map) => {
  const updateAboutStates = [
    state.getIn(['profile', 'person', 'updateState']),
    state.getIn(['profile', 'physicalAppearance', 'updateState']),
  ];

  const fetchAboutStates = [
    state.getIn(['profile', 'person', 'fetchState']),
    state.getIn(['profile', 'physicalAppearance', 'fetchState']),
  ];

  return {
    fetchAboutState: reduceRequestStates(fetchAboutStates),
    physicalAppearance: state.getIn(['profile', 'physicalAppearance', 'data'], Map()),
    selectedPerson: state.getIn(['profile', 'person', 'data'], Map()),
    updateAboutState: reduceRequestStates(updateAboutStates),
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    updateProfileAbout
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(EditAboutModal);
