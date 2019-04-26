// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Map } from 'immutable';
import { connect } from 'react-redux';

import SubjectQuickSearch from './SubjectQuickSearch';
import SubjectInformation from './SubjectInformation';
import { SUBJECT_INFORMATION } from '../../../utils/constants/CrisisTemplateConstants';
import { STATE } from '../../../utils/constants/StateConstants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

type Props = {
  values :Map;
};

class SubjectInformationManager extends Component<Props> {

  renderSubjectInformation = () => {
    const { values } = this.props;
    const isCreatingNewPerson = values.get(SUBJECT_INFORMATION.IS_NEW_PERSON);
    if (isCreatingNewPerson) {
      return <SubjectInformation />;
    }
    return null;
  }

  render() {
    return (
      <Wrapper>
        <SubjectQuickSearch />
        { this.renderSubjectInformation() }
      </Wrapper>
    );
  }
}

const mapStateToProps = (state :Map) => ({
  values: state.get(STATE.SUBJECT_INFORMATION),
});

// $FlowFixMe
export default connect(mapStateToProps)(SubjectInformationManager);
