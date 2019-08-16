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
  ${props => (props.isLoading ? aboutDetailSkeleton : null)}
`;

const Content = styled.div`
  flex: 1;
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

  renderContent = () => {
    const { content, icon, isLoading } = this.props;
    if (!isLoading) {
      const display = content || '---';
      return (
        <>
          {
            isPlainObject(icon) && (
              <IconWrapper>
                <FontAwesomeIcon icon={icon} fixedWidth />
              </IconWrapper>
            )
          }
          <Content>
            {display}
          </Content>
        </>
      );
    }
    return null;
  }

  render() {
    const { className, isLoading } = this.props;

    return (
      <Detail className={className} isLoading={isLoading}>
        { this.renderContent() }
      </Detail>
    );
  }
}

export default AboutDetail;
