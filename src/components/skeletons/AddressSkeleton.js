import { css, keyframes } from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { rgba } from 'polished';

const { PURPLES } = Colors;

const loading = keyframes`
  0% {
    background-position:
      -10vw 0, /* animation blur */
      0px 0px,
      0px 30px,
      0px 52px,
      0px 74px,
      0 0; /* card bg */
  };

  100% {
    background-position:
      100vw 0, /* animation blur */
      0px 0px,
      0px 30px,
      0px 52px,
      0px 74px,
      0 0; /* card bg */
  };
`;

const addressSkeleton = css`
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
    /* grey rectangles with 20px height */
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    /* layer 4: card bg */
    /* gray rectangle that covers whole element */
    linear-gradient(white 100%, transparent 0);
  background-size:
    100% 100%, /* animation blur */
    50% 1em,
    80% 1em,
    35% 1em,
    100% 1em,
    100% 100%; /* card bg */
  background-position:
    -10vw 0, /* animation blur */
    0px 0px,
    0px 30px,
    0px 52px,
    0px 74px,
    0 0; /* card bg */

  animation: ${loading} 2s infinite;
`;

export default addressSkeleton;
