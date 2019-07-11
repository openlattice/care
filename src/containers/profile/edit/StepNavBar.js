// @flow
import React from 'react';
import styled from 'styled-components';
import type { ChildrenArray } from 'react';

const StepNavBarWrapper = styled.div`
  display: flex;
  flex: 1 0 auto;
  justify-content: space-around;
`;

type Props = {
  children :ChildrenArray<any>;
};

const StepNavBar = ({ children } :Props) => {
  const newChildren = React.Children.toArray(children).reduce((acc, step, index) => {
    acc.push(step);
    if (index < React.Children.count(children) - 1) {
      acc.push(<div>im a divider</div>);
    }
    return acc;
  }, []);

  return (
    <StepNavBarWrapper>
      {newChildren}
    </StepNavBarWrapper>
  );
};

export default StepNavBar;
