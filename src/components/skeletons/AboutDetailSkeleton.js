import { css, keyframes } from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { rgba } from 'polished';

const { PURPLES } = Colors;

const loading = keyframes`
  0% {
    background-position:
      -10vw 0, /* animation blur */
      0px 5px;
  };

  100% {
    background-position:
      100vw 0, /* animation blur */
      0px 5px
  };
`;

const aboutDetailSkeleton = css`
  min-height: 100px;
  background-repeat: no-repeat;
  background-image:
    /* layer 0: animation blur */
    linear-gradient(
      90deg,
      ${rgba('white', 0)} 0,
      ${rgba('white', 0.8)} 50%,
      ${rgba('white', 0)} 100%
    ),
    /* layer 1: list item 1*/
    /* light rectangles with 20px height */
    linear-gradient(${PURPLES[6]} 1.35em, transparent 0),
  background-size:
    100% 100%, /* animation blur */
    100% 1.35em;
  background-position:
    -10vw 0, /* animation blur */
    0px 5px;

  animation: ${loading} 2s infinite;
`;

export {
  aboutDetailSkeleton
};
