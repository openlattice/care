// @flow
import React, { Component } from 'react';
import type { ComponentType, Node } from 'react';

import styled from 'styled-components';
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardSegment, Collapse, IconButton } from 'lattice-ui-kit';

import AccordionHeader from './AccordionHeader';

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const LabelWrapper = styled.div`
  display: flex;
  flex: 0 1 auto;
  align-items: center;
`;

const ToggleIcon = styled(FontAwesomeIcon)`
  transform: ${(props) => (props.open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
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
      <CardSegment padding="0">
        <HeaderWrapper onClick={this.onClick}>
          <LabelWrapper>
            <TitleComponent
                caption={caption}
                headline={headline}
                isOpen={isOpen} />
          </LabelWrapper>
          {
            !alwaysOpen && (
              <IconButton variant="text" size="small">
                <ToggleIcon
                    fixedWidth
                    icon={faChevronDown}
                    onClick={this.onClick}
                    open={isOpen} />
              </IconButton>
            )
          }
        </HeaderWrapper>
        <Collapse in={isOpen}>
          {children}
        </Collapse>
      </CardSegment>
    );
  }
}

export default AccordionSection;
