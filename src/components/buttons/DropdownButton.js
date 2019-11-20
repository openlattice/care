/*
 * @flow
 */

import React from 'react';
import styled, { css } from 'styled-components';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'lattice-ui-kit';

type Props = {
  title :string,
  options :{ label :string, onClick :() => void }[],
  openAbove? :boolean,
  fullSize? :boolean
}

type State = {
  open :boolean
}

const DropdownButtonWrapper = styled.div`
  border: none;
  ${(props) => {
    if (props.open) {
      return css`
        box-shadow: 0 2px 8px -2px rgba(17, 51, 85, 0.15);
      `;
    }
    return '';
  }}
  width: ${(props) => (props.fullSize ? '100%' : 'auto')};
  display: flex;
  flex: 0 auto;
  flex-direction: column;
  margin: 0;
  padding: 0;
  position: relative;
`;

const BaseButton = styled(Button)`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 600;
  position: relative;

  svg {
    margin-left: 10px;
  }
`;

const MenuContainer = styled.div`
  background-color: #fefefe;
  border-radius: 5px;
  border: 1px solid #e1e1eb;
  position: absolute;
  z-index: 1;
  min-width: max-content;
  max-width: ${(props) => (props.fullSize ? '100%' : '400px')};
  width: ${(props) => (props.fullSize ? '100%' : 'auto')};
  visibility: ${(props) => (props.open ? 'visible' : 'hidden')}};
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  top: ${(props) => (props.openAbove ? 'auto' : '45px')};
  bottom: ${(props) => (props.openAbove ? '45px' : 'auto')};
  right: ${(props) => (props.openAbove ? 'auto' : '0')};;
  left: ${(props) => (props.openAbove ? '0' : 'auto')};;
  overflow: visible;
  display: flex;
  flex-direction: column;

  button {
    width: 100%;
    padding: 15px 20px;
    text-transform: none;
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    color: #2e2e34;
    border: none;
    min-width: fit-content !important;

    &:hover {
      background-color: #e6e6f7;
    }
  }
`;

export default class DropdownButton extends React.Component<Props, State> {

  static defaultProps = {
    openAbove: false,
    fullSize: false
  };

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
    return (
      <DropdownButtonWrapper open={this.state.open} {...this.props}>
        <BaseButton open={this.state.open} onClick={this.toggleDropdown} onBlur={this.toggleDropdown}>
          {this.props.title}
          <FontAwesomeIcon icon={faChevronDown} fixedWidth/>
        </BaseButton>
        <MenuContainer open={this.state.open} {...this.props}>
          {this.props.options.map((option) => (
            <button key={option.label} onClick={this.handleOnClick} onMouseDown={option.onClick}>
              {option.label}
            </button>
          ))}
        </MenuContainer>
      </DropdownButtonWrapper>
    );
  }
}
