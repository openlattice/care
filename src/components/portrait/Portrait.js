// @flow
import React from 'react';
import styled from 'styled-components';
import PlaceholderPortrait from './PlaceholderPortrait';

type Props = {
  imageUrl ? :string;
  height ? :string;
  width ? :string;
}
const Image = styled.img`
  border-radius: 10%;
`;

const Portrait = (props :Props) => {
  const {
    height,
    imageUrl,
    width
  } = props;

  if (!imageUrl) {
    return (
      <PlaceholderPortrait
          height={height}
          width={width} />
    );
  }

  return <Image src={imageUrl} height={height} width={width} />;
};

Portrait.defaultProps = {
  height: '265',
  imageUrl: undefined,
  width: '200',
};

export default Portrait;
