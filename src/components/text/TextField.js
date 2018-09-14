/*
 * @flow
 */

import React, { Component } from 'react';

import isFunction from 'lodash/isFunction';
import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

import { isNonEmptyString } from '../../utils/LangUtils';
import { randomStringId } from '../../utils/Utils';

const { NEUTRALS, PURPLES } = Colors;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const StyledInput = styled.input`
  background-color: ${NEUTRALS[8]};
  border: 1px solid ${NEUTRALS[4]};
  border-radius: 3px;
  color: #2e2e34;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: normal;
  outline: none;
  padding: 10px 20px;
  &:focus {
    border-color: ${PURPLES[1]};
  }
  &::placeholder {
    color: ${NEUTRALS[1]};
  }
`;

const StyledLabel = styled.label`
  color: ${NEUTRALS[0]};
  font-size: 14px;
  font-weight: normal;
  margin: 0 0 10px 0;
`;

type Props = {
  className ? :string;
  label ? :string;
  name ? :string;
  placeholder ? :string;
  onChange :Function;
};

type State = {
  randomId :string;
};

class TextField extends Component<Props, State> {

  static defaultProps = {
    className: '',
    label: undefined,
    name: undefined,
    placeholder: undefined,
  };

  constructor(props :Props) {

    super(props);

    // TODO: is this a good pattern to follow for <input>'s id and <label>'s htmlFor?
    this.state = {
      randomId: randomStringId(),
    };
  }

  handleOnChange = (event :SyntheticInputEvent<*>) => {

    const { onChange } = this.props;
    if (isFunction(onChange)) {
      onChange(event);
    }
  }

  render() {

    const {
      className,
      label,
      name,
      placeholder
    } = this.props;
    const { randomId } = this.state;

    // TODO: should the <label> tag be wrapping the <textarea>
    return (
      <FieldWrapper>
        {
          isNonEmptyString(label)
            ? <StyledLabel htmlFor={randomId}>{ label }</StyledLabel>
            : null
        }
        <StyledInput
            className={className}
            id={randomId}
            name={name}
            onChange={this.handleOnChange}
            placeholder={placeholder}
            type="text" />
      </FieldWrapper>
    );
  }
}

export default TextField;
