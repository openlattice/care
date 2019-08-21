// @flow
import React from 'react';
import styled from 'styled-components';
import PlaceholderPortrait from './PlaceholderPortrait';

type Props = {
  imageUrl ? :string;
  height ? :string;
  width ? :string;
  isMalfoy ? :boolean;
}
const Image = styled.img`
  border-radius: 10%;
`;

const MALFOY_URL = 'https://i.imgur.com/7CZAw5y.png';

const Portrait = (props :Props) => {
  const {
    height,
    imageUrl,
    isMalfoy,
    width
  } = props;

  if (isMalfoy) {
    return <Image src={MALFOY_URL} height={height} width={width} />;
  }

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
  isMalfoy: false,
  width: '200',
};

export default Portrait;
