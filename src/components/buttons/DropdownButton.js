/*
 * @flow
 */

import React, { Component } from 'react';
import styled from 'styled-components';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Colors } from 'lattice-ui-kit';

const { NEUTRALS } = Colors;

const DropdownButtonWrapper = styled.div`
  display: inline-flex;
  position: relative;
`;

const BaseButton = styled(Button)`
  svg {
    margin-left: 10px;
  }
`;

const MenuContainer = styled.div`
  background-color: white;
  border-radius: 3px;
  border: 1px solid ${NEUTRALS[4]};
  position: absolute;
  z-index: 1;
  min-width: max-content;
  max-width: 400px;
  width: auto;
  visibility: ${(props) => (props.open ? 'visible' : 'hidden')}};
  box-shadow: 0 2px 8px -2px rgba(0,0,0,0.15);
  top: ${(props) => (props.offset === 'sm' ? '33px' : '45px')};
  bottom: auto;
  right: 0;
  left: auto;
  padding: 4px 0;
  overflow: visible;
  display: flex;
  flex-direction: column;

  button {
    padding: 8px 12px;
    text-transform: none;
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    color: ${NEUTRALS[0]};
    border: none;
    min-width: fit-content;

    &:hover {
      background-color: ${NEUTRALS[6]};
    }
  }
`;

type Props = {
  title :string,
  options :{ label :string, onClick :() => void }[];
  size :string;
};

type State = {
  open :boolean
};

export default class DropdownButton extends Component<Props, State> {

  static defaultProps = {
    openAbove: false,
    fullSize: false,
  };

  menuRef = React.createRef<MenuContainer>();
  constructor(props :Props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toggleDropdown = (e :SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  };

  handleOnClick = (e :SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    this.setState({ open: false });
  }

  render() {
    const { open } = this.state;
    const { options, size, title } = this.props;

    return (
      <DropdownButtonWrapper>
        <BaseButton
            size={size}
            onClick={this.toggleDropdown}
            onBlur={this.toggleDropdown}>
          {title}
          <FontAwesomeIcon icon={faChevronDown} fixedWidth/>
        </BaseButton>
        <MenuContainer open={open} offset={size}>
          {options.map((option) => (
            <button key={option.label} onClick={this.handleOnClick} onMouseDown={option.onClick}>
              {option.label}
            </button>
          ))}
        </MenuContainer>
      </DropdownButtonWrapper>
    );
  }
};
