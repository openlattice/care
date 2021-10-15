import { RequestStates } from 'redux-reqseq';
import { css } from 'styled-components';

const sizes = {
  desktop: 992,
  tablet: 768,
  phone: 576,
};

// https://www.styled-components.com/docs/advanced#media-templates
// font-size: 16
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(...args)}
    }
  `;

  return acc;
}, {});

const getButtonColor = (requestState) => {
  switch (requestState) {
    case RequestStates.SUCCESS: {
      return 'success';
    }
    case RequestStates.FAILURE: {
      return 'error';
    }
    default:
      return 'primary';
  }
};

export {
  getButtonColor,
  media
};
