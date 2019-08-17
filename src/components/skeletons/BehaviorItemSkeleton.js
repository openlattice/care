import { css, keyframes } from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { rgba } from 'polished';

const { PURPLES } = Colors;

const loading = keyframes`
  0% {
    background-position:
      -10vw 0, /* animation blur */
      0px 5px, 80% 5px, 100% 5px,
      0px 37px, 80% 37px, 100% 37px,
      0px 71px, 80% 71px, 100% 71px,
      0 0; /* card bg */
  };

  100% {
    background-position:
      100vw 0, /* animation blur */
      0px 5px, 80% 5px, 100% 5px,
      0px 37px, 80% 37px, 100% 37px,
      0px 71px, 80% 71px, 100% 71px,
      0 0; /* card bg */
  };
`;

const behaviorItemSkeleton = css`
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
    linear-gradient(${PURPLES[6]} 1.35em, transparent 0),
    linear-gradient(${PURPLES[6]} 1.35em, transparent 0),
    linear-gradient(${PURPLES[6]} 1.35em, transparent 0),
    /* layer 2: list item 2*/
    linear-gradient(${PURPLES[6]} 1.35em, transparent 0),
    linear-gradient(${PURPLES[6]} 1.35em, transparent 0),
    linear-gradient(${PURPLES[6]} 1.35em, transparent 0),
    /* layer 3: list item 3*/
    linear-gradient(${PURPLES[6]} 1.35em, transparent 0),
    linear-gradient(${PURPLES[6]} 1.35em, transparent 0),
    linear-gradient(${PURPLES[6]} 1.35em, transparent 0),
    /* layer 4: card bg */
    /* gray rectangle that covers whole element */
    linear-gradient(white 100%, transparent 0);
  background-size:
    100% 100%, /* animation blur */
    66% 1.35em, 15% 1.35em, 15% 1.35em,
    66% 1.35em, 15% 1.35em, 15% 1.35em,
    66% 1.35em, 15% 1.35em, 15% 1.35em,
    100% 100%; /* card bg */
  background-position:
    -10vw 0, /* animation blur */
    0px 5px, 80% 5px, 100% 5px,
    0px 37px, 80% 37px, 100% 37px,
    0px 71px, 80% 71px, 100% 71px,
    0 0; /* card bg */

  animation: ${loading} 2s infinite;
`;

export default behaviorItemSkeleton;
