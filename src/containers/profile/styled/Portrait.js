// @flow
import React from 'react';
import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPortrait } from '@fortawesome/pro-solid-svg-icons';

const { NEUTRALS } = Colors;

const PlaceholderPortrait = styled(FontAwesomeIcon)`
  height: ${props => `${props.height}px`} !important;
  width: ${props => `${props.width}px`} !important;
`;

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
    return <Image src={MALFOY_URL} alt={imageUrl} height={height} width={width} />;
  }

  if (!imageUrl) {
    return (
      <PlaceholderPortrait
          icon={faPortrait}
          color={NEUTRALS[5]}
          height={height}
          width={width} />
    );
  }

  return <Image src={imageUrl} alt={imageUrl} height={height} width={width} />;
};

Portrait.defaultProps = {
  height: '265',
  imageUrl: undefined,
  isMalfoy: false,
  width: '200',
};

export default Portrait;
