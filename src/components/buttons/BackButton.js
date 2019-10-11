import styled from 'styled-components';

export default styled.button.attrs({
  type: 'button'
})`
  padding: 10px 20px;
  margin: ${(props) => (props.noMargin ? 0 : 15)}px;
  text-transform: uppercase;
  font-size: 14px;
  border-radius: 3px;
  border: none;
  background-color: transparent;
  color: #6124e2;

  &:hover {
    font-weight: 600;
  }

  &:focus {
    outline: none;
  }

  &:hover:enabled {
    cursor: pointer;
  }
`;
