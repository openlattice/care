// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Map } from 'immutable';
import { Card, CardHeader, Modal } from 'lattice-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/pro-solid-svg-icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';

import type { RequestSequence, RequestState } from 'redux-reqseq';
import type { Dispatch } from 'redux';

import EditProfileForm from '../EditProfileForm';
import { updateProfileAbout } from '../ProfileActions';

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
  isOpen :boolean;
  onClose :() => void;
  physicalAppearance :Map;
  selectedPerson :Map;
  updateAboutState :RequestState;
};

class EditAboutModal extends Component<Props> {

  modalRef :{ current :null | HTMLDivElement } = React.createRef();

  componentDidUpdate(prevProps :Props) {
    const { updateAboutState, onClose } = this.props;
    const { updateAboutState: prevUpdateAboutState } = prevProps;
    if (updateAboutState === RequestStates.SUCCESS
      && prevUpdateAboutState === RequestStates.PENDING) {
      onClose();
    }
  }

  render() {
    const {
      actions,
      isOpen,
      onClose,
      physicalAppearance,
      selectedPerson,
      updateAboutState
    } = this.props;

    return (
      <>
        { isOpen && (
          <Modal
              isVisible
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
              <EditProfileForm
                  isLoading={updateAboutState === RequestStates.PENDING}
                  onDiscard={onClose}
                  onSubmit={actions.updateProfileAbout}
                  physicalAppearance={physicalAppearance}
                  selectedPerson={selectedPerson} />
            </StyledCard>
          </Modal>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  physicalAppearance: state.getIn(['profile', 'physicalAppearance'], Map()),
  selectedPerson: state.getIn(['profile', 'selectedPerson'], Map()),
  updateAboutState: state.getIn(['profile', 'updateAboutState'], RequestStates.STANDBY),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    updateProfileAbout
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(EditAboutModal);
