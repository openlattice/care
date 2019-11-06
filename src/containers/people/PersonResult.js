// @flow

import React, { Component } from 'react';
import isFunction from 'lodash/isFunction';
import styled from 'styled-components';
import { Constants } from 'lattice';
import { Map, getIn } from 'immutable';
import { Button, Card } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import {
  faUser,
  faVenusMars,
  faBirthdayCake
} from '@fortawesome/pro-solid-svg-icons';

import Portrait from '../../components/portrait/Portrait';
import LinkButton from '../../components/buttons/LinkButton';
import Detail from '../../components/premium/styled/Detail';
import { getImageDataFromEntity } from '../../utils/BinaryUtils';
import { getDobFromPerson, getLastFirstMiFromPerson } from '../../utils/PersonUtils';
import { PERSON_SEX_FQN, PERSON_RACE_FQN } from '../../edm/DataModelFqns';
import { CRISIS_PATH } from '../../core/router/Routes';

const { OPENLATTICE_ID_FQN } = Constants;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  margin: 0 30px;
  font-size: 20px;
`;

const Text = styled.div`
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ bold }) => (bold && '600')};
  text-transform: ${({ uppercase }) => (uppercase && 'uppercase')};
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 30px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
`;

const BigButton = styled(Button)`
  height: 100%;
  margin-bottom: 10px;
`;

type Props = {
  imageUrl ? :string;
  onClick ? :(result :Map) => void;
  result :Map;
}

class PersonResult extends Component<Props> {

  static defaultProps = {
    imageUrl: undefined,
    onClick: undefined,
  }

  handleClick = () => {
    const { result, onClick } = this.props;
    if (isFunction(onClick)) {
      onClick(result);
    }
  }

  render() {
    const { result, imageUrl } = this.props;
    const fullName = getLastFirstMiFromPerson(result, true);
    // $FlowFixMe
    const dob :string = getDobFromPerson(result, false, '---');
    const sex = result.getIn([PERSON_SEX_FQN, 0]);
    const race = result.getIn([PERSON_RACE_FQN, 0]);

    return (
      <Card>
        <ResultWrapper>
          <Portrait imageUrl={imageUrl} height="128" width="96" />
          <Details>
            <Text bold uppercase fontSize="24px">{fullName}</Text>
            <Detail content={dob} icon={faBirthdayCake} />
            <Detail content={sex} icon={faVenusMars} />
            <Detail content={race} icon={faUser} />
          </Details>
          <Actions>
            <BigButton mode="secondary" onClick={this.handleClick}>View</BigButton>
            <LinkButton to={`${CRISIS_PATH}/1`} state={result}>
              New Report
            </LinkButton>
          </Actions>
        </ResultWrapper>
      </Card>
    );
  }
}

const mapStateToProps = (state :Map, ownProps :any) => {
  const { result } = ownProps;
  const entityKeyId = getIn(result, [OPENLATTICE_ID_FQN, 0]);
  const profilePic = state.getIn(['people', 'profilePicsByEKID', entityKeyId], Map());

  return {
    imageUrl: getImageDataFromEntity(profilePic)
  };
};

// $FlowFixMe
export default connect(mapStateToProps)(PersonResult);
export type { Props as ResultProps };
