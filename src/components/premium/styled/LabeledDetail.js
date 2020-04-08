// @flow
import React from 'react';
import type { Node } from 'react';

import styled from 'styled-components';
import { Label, Skeleton } from 'lattice-ui-kit';

const LabeledDetailWrapper = styled.div`
  display: grid;
  grid-template-columns: ${(props) => (props.noLabel ? '1fr' : '90px 1fr')};
  grid-gap: 10px;
`;

const Content = styled.div`
  display: inline-block;
  font-size: 0.875rem;
  word-break: break-word;
  white-space: pre-wrap;
`;

const LabelHeader = styled(Label)`
  margin: 0;
  line-height: 1.3125rem;
`;

type Props = {
  className ? :string;
  content ? :Node;
  label ? :string;
  isLoading ? :boolean;
}

const LabeledDetail = (props :Props) => {

  const {
    content,
    label,
    className,
    isLoading
  } = props;

  if (isLoading) {
    return <Skeleton />;
  }

  const display = content || '---';

  return (
    <LabeledDetailWrapper className={className} noLabel={!label}>
      {
        label && <LabelHeader subtle>{label}</LabelHeader>
      }
      <Content>
        {display}
      </Content>
    </LabeledDetailWrapper>
  );
};

LabeledDetail.defaultProps = {
  className: undefined,
  content: '',
  label: '',
  isLoading: false
};

export default LabeledDetail;
