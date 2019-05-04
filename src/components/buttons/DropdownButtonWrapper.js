import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';

import BasicButton from './BasicButton';

/*
 * styled components
 */

const TEXT_COLOR = '#8e929b';

const RefWrapper = styled.div`
  width: ${props => (props.fullSize ? '100%' : 'auto')};
`;

const SearchableSelectWrapper = styled.div`
  border: none;
  display: flex;
  flex: 0 auto;
  flex-direction: column;
  width: ${props => (props.fullSize ? '100%' : 'auto')};
  margin: 0;
  padding: 0;
  position: ${props => (props.relativeToPage ? 'statuc' : 'relative')};
`;

const SearchInputWrapper = styled.div`
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  height: ${props => (props.short ? '39px' : '45px')};
  position: relative;
`;

const SearchIcon = styled.div`
  align-self: center;
  position: absolute;
  margin: 0 20px;
  right: 0;
  color: ${props => (props.open ? '#ffffff' : TEXT_COLOR)}
`;


const SearchButton = styled(BasicButton)`
  width: ${props => (props.fullSize ? '100%' : 'auto')};
  font-family: 'Open Sans', sans-serif;
  flex: 1 0 auto;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  padding: 0 ${props => (props.transparent ? 20 : 45)}px 0 20px;
  outline: none;
  border: none;
  ${(props) => {
    if (props.transparent) {
      return css`
        background-color: transparent;

        &:hover {
          background-color: transparent !important;
          color: #555e6f;
        }
      `;
    }
    return '';
  }}
  ${(props) => {
    if (props.open) {
      return css`
        background-color: ${props.transparent ? 'transparent' : TEXT_COLOR};
        color: ${props.transparent ? '#555e6f' : '#ffffff'};

        &:hover {
          background-color: ${props.transparent ? 'transparent' : TEXT_COLOR} !important;
          color: ${props.transparent ? '#555e6f' : '#ffffff'} !important;
        }
      `;
    }
    return '';
  }}
`;

const DataTableWrapper = styled.div`
  background-color: #fefefe;
  border-radius: 5px;
  border: 1px solid #e1e1eb;
  position: absolute;
  z-index: 1;
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')}};
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  margin: ${props => (props.openAbove ? '-303px 0 0 0' : '45px 0 0 0')};
  bottom: ${props => (props.openAbove ? '45px' : 'auto')};
  max-width: ${props => (props.fullSize ? '100%' : '400px')};
  min-width: ${props => (props.width ? `${props.width}px` : 'auto')};

  ${props => (props.relativeToPage ? (
    css`
      left: 10px;
      right: 10px;
    `
  ) : css`
      width: ${props.fullSize ? '100%' : 'auto'};
    `)}
`;

export default class DropdownButtonWrapper extends Component {

  static defaultProps = {
    openAbove: false,
    transparent: false,
    fullSize: false,
    hideOnClick: false,
    relativeToPage: false
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisibleDataTable: false
    };
  }

  componentWillMount() {
    document.addEventListener('click', this.closeDataTable, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeDataTable, false);
  }

  closeDataTable = (e) => {
    const { hideOnClick } = this.props;
    if ((!hideOnClick && this.node.contains(e.target)) || this.togglebutton.contains(e.target)) {
      return;
    }
    this.setState({ isVisibleDataTable: false });
  }

  toggleDataTable = (e) => {
    e.stopPropagation();
    const { isVisibleDataTable } = this.state;

    this.setState({
      isVisibleDataTable: !isVisibleDataTable
    });
  }

  handleOnSelect = (label) => {
    const { onSelect, options } = this.props;
    onSelect(options.get(label));
  }

  render() {
    const {
      title,
      short,
      fullSize,
      children,
      width,
      transparent
    } = this.props;
    const { isVisibleDataTable } = this.state;
    return (
      <RefWrapper ref={(node) => { this.node = node; }} {...this.props}>
        <SearchableSelectWrapper isVisibleDataTable={isVisibleDataTable} {...this.props}>
          <SearchInputWrapper short={short}>
            <SearchButton
                ref={(togglebutton) => { this.togglebutton = togglebutton; }}
                open={isVisibleDataTable}
                onClick={this.toggleDataTable}
                {...this.props}>
              {title}
            </SearchButton>
            {
              transparent ? null : (
                <SearchIcon open={isVisibleDataTable}>
                  <FontAwesomeIcon icon={isVisibleDataTable ? faChevronUp : faChevronDown} />
                </SearchIcon>
              )
            }
          </SearchInputWrapper>
          {
            !isVisibleDataTable
              ? null
              : (
                <DataTableWrapper isVisible={isVisibleDataTable} {...this.props}>
                  {children}
                </DataTableWrapper>
              )
          }
        </SearchableSelectWrapper>
      </RefWrapper>
    );
  }

}
