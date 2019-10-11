/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import styled, { css } from 'styled-components';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import { faSearch } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input, Spinner } from 'lattice-ui-kit';

import downArrowIcon from '../../assets/svg/down-arrow.svg';
import { BLACK } from '../../shared/Colors';

/*
 * styled components
 */

const SearchableSelectWrapper = styled.div`
  border: none;
  ${(props) => {
    if (props.isVisibleDataTable) {
      return css`
        box-shadow: 0 2px 8px -2px rgba(17, 51, 85, 0.15);
      `;
    }
    return '';
  }}
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  margin: 0;
  padding: 0;
  position: relative;
  width: 100%;
  max-height: fit-content;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  height: ${(props) => (props.short ? '39px' : '45px')};
  position: relative;
`;

const inputStyle = css`
  border: 1px solid #dcdce7;
  border-radius: 3px;
  color: #135;
  flex: 1 0 auto;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 24px;
  outline: none;
  padding: 0 ${(props) => (props.dropdownIcon ? 45 : 35)}px 0 ${(props) => (props.searchIcon ? 35 : 20)}px;
  &:focus {
    border-color: #6124e2;
  }
  &::placeholder {
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    color: #8e929b;
  }
`;

const SearchInput = styled(Input).attrs({
  type: 'text'
})`
  padding: 0 ${(props) => (props.dropdownIcon ? 45 : 35)}px 0 ${(props) => (props.searchIcon ? 35 : 20)}px;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
`;

const SearchIcon = styled.div`
  align-self: center;
  color: #687F96;
  position: absolute;
  left: 10px;
`;

const DropdownIcon = styled.div`
  align-self: center;
  color: #687F96;
  position: absolute;
  margin: 0 20px;
  right: 0;
`;


const SearchButton = styled.button`
  ${inputStyle}
  text-align: left;
  background-color: ${(props) => (props.transparent ? '#f9f9fd' : '#ffffff')};
`;

const CloseIcon = styled.div`
  align-self: center;
  color: #687F96;
  position: absolute;
  right: 20px;

  &:hover {
    cursor: pointer;
  }
`;

const DataTableWrapper = styled.div`
  background-color: #fefefe;
  border-radius: 5px;
  border: 1px solid #e1e1eb;
  position: absolute;
  z-index: 1;
  width: 100%;
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')}};
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  margin: ${(props) => (props.openAbove ? '-303px 0 0 0' : '45px 0 0 0')};
  bottom: ${(props) => (props.openAbove ? '45px' : 'auto')};
`;

const NoContentWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: ${(props) => (props.searching ? 50 : 30)}px;
  font-size: 14px;
  font-weight: 600;
  font-style: italic;
  color: ${BLACK};
`;

const SearchOption = styled.div`
  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: ${BLACK};

  &:not(:last-child) {
    border-bottom: ${(props) => (props.withBorders ? '1px solid #dcdce7' : 'none')};
  }

  &:hover {
    background-color: #f0f0f7;
    cursor: pointer;
  }

  &:active {
    background-color: #e4d8ff;
  }
`;

const SearchOptionContainer = styled.div`
  max-height: 300px;
  overflow-x: auto;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/*
 * types
 */

type Props = {
  options :Map<*, *>,
  className? :string,
  searchPlaceholder :string,
  onSelect :Function,
  onInputChange? :Function,
  short :?boolean,
  value :?string,
  onClear? :?() => void,
  transparent? :boolean,
  openAbove? :boolean,
  selectOnly? :boolean,
  disabled? :boolean,
  searchIcon? :boolean,
  dropdownIcon? :boolean,
  split? :boolean,
  noFilter? :boolean,
  withBorders? :boolean,
  fullWidth? :boolean,
  isLoadingResults? :boolean,
  noResults? :boolean
}

type State = {
  filteredTypes :List<string>,
  isVisibleDataTable :boolean,
  searchQuery :string
}

class SearchableSelect extends React.Component<Props, State> {

  static defaultProps = {
    options: Immutable.List(),
    className: '',
    searchPlaceholder: 'Search...',
    onSelect: () => {},
    onInputChange: () => {},
    onClear: () => {},
    short: false,
    value: '',
    transparent: false,
    openAbove: false,
    selectOnly: false,
    disabled: false,
    searchIcon: false,
    dropdownIcon: true,
    split: false,
    noFilter: false,
    withBorders: false,
    fullWidth: false,
    isLoadingResults: false,
    noResults: false
  };

  constructor(props :Props) {

    super(props);

    this.state = {
      filteredTypes: props.options.keySeq(),
      isVisibleDataTable: false,
      searchQuery: ''
    };
  }

  componentWillReceiveProps(nextProps :Props) {

    this.setState({
      filteredTypes: nextProps.options.keySeq(),
      searchQuery: ''
    });
  }

  hideDataTable = () => {

    this.setState({
      isVisibleDataTable: false,
      searchQuery: ''
    });
  }

  showDataTable = (e) => {
    e.stopPropagation();

    this.setState({
      isVisibleDataTable: true,
      searchQuery: ''
    });
  }

  handleOnSelect = (label :string) => {
    const { options, onSelect } = this.props;

    onSelect(options.get(label));
    this.setState({
      searchQuery: ''
    });
  }

  filterResults = (value :string) => {
    const { options, split } = this.props;
    const containsStr = (str1, str2) => str1.toLowerCase().includes(str2.toLowerCase().trim());

    return options.filter((obj, label) => (
      split ? (containsStr(label.get(0)) || containsStr(label.get(1))) : containsStr(label, value)));
  }

  handleOnChangeSearchQuery = (event :SyntheticInputEvent<*>) => {
    const { onInputChange, noFilter } = this.props;
    const { filteredTypes } = this.state;

    onInputChange(event);

    this.setState({
      filteredTypes: noFilter ? filteredTypes : this.filterResults(event.target.value).keySeq(),
      searchQuery: event.target.value
    });
  }

  renderTable = () => {
    const { split, withBorders } = this.props;
    const { filteredTypes } = this.state;

    const options = filteredTypes.map((type) => (
      <SearchOption
          withBorders={withBorders}
          key={type}
          onMouseDown={() => this.handleOnSelect(type)}>
        <span>{split ? type.get(0) : type}</span>
        <span>{split && type.get(1) ? type.get(1) : null}</span>
      </SearchOption>
    ));
    return <SearchOptionContainer>{options}</SearchOptionContainer>;
  }

  renderDropdownContents = () => {
    const { isVisibleDataTable } = this.state;
    const {
      openAbove,
      value,
      isLoadingResults,
      noResults
    } = this.props;

    if (isLoadingResults) {
      return (
        <DataTableWrapper isVisible openAbove={openAbove}>
          <NoContentWrapper searching>
            <Spinner size="3x" />
          </NoContentWrapper>
        </DataTableWrapper>
      );
    }

    if (isVisibleDataTable && value.length) {
      return (
        <DataTableWrapper isVisible={isVisibleDataTable} openAbove={openAbove}>
          {noResults ? <NoContentWrapper>No results</NoContentWrapper> : this.renderTable()}
        </DataTableWrapper>
      );
    }

    return null;
  }

  render() {
    const { isVisibleDataTable, searchQuery } = this.state;
    const {
      className,
      short,
      openAbove,
      selectOnly,
      disabled,
      transparent,
      fullWidth,
      searchPlaceholder,
      onClear,
      searchIcon,
      dropdownIcon,
      value
    } = this.props;

    return (
      <SearchableSelectWrapper isVisibleDataTable={isVisibleDataTable} className={className}>
        <SearchInputWrapper short={short}>
          {
            !searchIcon ? null : (
              <SearchIcon>
                <FontAwesomeIcon icon={faSearch} />
              </SearchIcon>
            )
          }
          {
            selectOnly ? (
              <SearchButton
                  disabled={disabled}
                  transparent={transparent}
                  onBlur={this.hideDataTable}
                  onChange={this.handleOnChangeSearchQuery}
                  onClick={this.showDataTable}>
                {value || searchPlaceholder}
              </SearchButton>
            ) : (
              <SearchInput
                  placeholder={searchPlaceholder}
                  transparent={transparent}
                  value={value}
                  onBlur={this.hideDataTable}
                  onChange={this.handleOnChangeSearchQuery}
                  onClick={this.showDataTable}
                  searchIcon={searchIcon}
                  fullWidth={fullWidth}
                  dropdownIcon={dropdownIcon} />
            )
          }
          {
            (onClear && value) || !dropdownIcon ? null : (
              <DropdownIcon>
                <img src={downArrowIcon} alt="" />
              </DropdownIcon>
            )
          }
          {
            !onClear || !value
              ? null
              : (
                <CloseIcon onClick={onClear}>
                  <FontAwesomeIcon icon={faTimes} />
                </CloseIcon>
              )
          }
        </SearchInputWrapper>
        {this.renderDropdownContents()}
      </SearchableSelectWrapper>
    );
  }
}

export default SearchableSelect;
