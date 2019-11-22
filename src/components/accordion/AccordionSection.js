// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, CardSegment } from 'lattice-ui-kit';
import type { Node, ComponentType } from 'react';

import AccordionHeader from './AccordionHeader';
import { groupNeighborsByEntitySetIds } from '../../utils/DataUtils';

const AccordionWrapper = styled(CardSegment)`
  display: flex;
  flex-direction: column;
  padding: 15px 30px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const ChildWrapper = styled.div`
  margin-top: 20px;
`;

const LabelWrapper = styled.div`
  display: flex;
  flex: 0 1 auto;
  align-items: center;
`;

const ToggleIcon = styled(FontAwesomeIcon).attrs({
  icon: (props :any) => (props.open ? faChevronUp : faChevronDown)
})``;

const ToggleButton = styled(Button)`
  color: inherit;
`;

export type AccordionSectionProps = {
  alwaysOpen :boolean;
  caption :string;
  children :Node;
  headline :string;
  index :number;
  isOpen :boolean;
  onClick :(index :number) => void;
  titleComponent :ComponentType<any>;
};

class AccordionSection extends Component<AccordionSectionProps> {

  static defaultProps = {
    alwaysOpen: false,
    caption: undefined,
    headline: undefined,
    titleComponent: AccordionHeader,
  };

  onClick = () => {
    const { index, onClick } = this.props;
    onClick(index);
  }

  render() {
    const {
      alwaysOpen,
      caption,
      children,
      headline,
      isOpen,
      titleComponent: TitleComponent,
    } = this.props;
    return (
      <AccordionWrapper isOpen={isOpen}>
        <HeaderWrapper onClick={this.onClick}>
          <LabelWrapper>
            <TitleComponent
                caption={caption}
                headline={headline}
                isOpen={isOpen} />
          </LabelWrapper>
          {
            !alwaysOpen && (
              <ToggleButton mode="subtle">
                <ToggleIcon open={isOpen} onClick={this.onClick} />
              </ToggleButton>
            )
          }
        </HeaderWrapper>
        {
          isOpen && (
            <ChildWrapper>
              {children}
            </ChildWrapper>
          )
        }
      </AccordionWrapper>
    );
  }
}

export default AccordionSection;
