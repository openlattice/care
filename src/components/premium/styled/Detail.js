// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import isPlainObject from 'lodash/isPlainObject';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fullLineSkeleton } from '../../skeletons';

const DetailWrapper = styled.div`
  display: flex;
  ${(props) => (props.isLoading ? fullLineSkeleton : null)}
`;

const Content = styled.div`
  flex: 1;
  word-break: break-word;
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

class Detail extends Component<Props> {
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
      <DetailWrapper className={className} isLoading={isLoading}>
        { this.renderContent() }
      </DetailWrapper>
    );
  }
}

export default Detail;
