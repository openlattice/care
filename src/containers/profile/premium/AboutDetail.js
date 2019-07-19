// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import isPlainObject from 'lodash/isPlainObject';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { aboutDetailSkeleton } from '../../../components/skeletons';

const Detail = styled.div`
  display: flex;
  flex: 1 0 auto;
`;

const Content = styled.div`
  flex: 1;
  ${props => (props.isLoading ? aboutDetailSkeleton : null)}
`;

const IconWrapper = styled.span`
  align-items: center;
  margin-right: 10px;
`;

type Props = {
  className ? :string;
  content ? :string;
  icon ? :IconDefinition;
  isLoading ? :boolean;
}

class AboutDetail extends Component<Props> {
  static defaultProps = {
    className: undefined,
    content: '',
    icon: undefined,
    isLoading: false
  };

  renderIcon = () => {
    const { icon } = this.props;
    if (isPlainObject(icon)) {
      return (
        <IconWrapper>
          <FontAwesomeIcon icon={icon} fixedWidth />
        </IconWrapper>
      );
    }
    return null;
  }

  render() {
    const { className, content, isLoading } = this.props;
    let display = content || '---';
    // if loading, hide content
    if (isLoading) {
      display = '';
    }

    return (
      <Detail className={className}>
        { this.renderIcon() }
        <Content isLoading={isLoading}>
          {display}
        </Content>
      </Detail>
    );
  }
}

export default AboutDetail;
