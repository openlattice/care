import { css, keyframes } from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { rgba } from 'polished';

const { PURPLES } = Colors;

const loading = keyframes`
  0% {
    background-position:
      -10vw 0, /* animation blur */
      3px 5px, 20px 0,
      3px 27px, 20px 22px,
      3px 49px, 20px 44px,
      0 0; /* card bg */
  };

  100% {
    background-position:
      100vw 0, /* animation blur */
      3px 5px, 20px 0,
      3px 27px, 20px 22px,
      3px 49px, 20px 44px,
      0 0; /* card bg */
  };
`;

const bulletsSkeleton = css`
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
    /* layer 1: bulleted item 1*/
    radial-gradient(circle 3px, ${PURPLES[6]} 100%, transparent 0),
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    /* bulleted item 2 */
    radial-gradient(circle 3px, ${PURPLES[6]} 100%, transparent 0),
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    /* bulleted item 3 */
    radial-gradient(circle 3px, ${PURPLES[6]} 100%, transparent 0),
    linear-gradient(${PURPLES[6]} 1em, transparent 0),
    /* layer 4: card bg */
    /* gray rectangle that covers whole element */
    linear-gradient(white 100%, transparent 0);
  background-size:
    100% 100%, /* animation blur */
    6px 6px, 85% 1em,
    6px 6px, 70% 1em,
    6px 6px, 75% 1em,
    100% 100%; /* card bg */
  background-position:
    -10vw 0, /* animation blur */
    3px 5px, 20px 0,
    3px 27px, 20px 22px,
    3px 49px, 20px 44px,
    0 0; /* card bg */

  animation: ${loading} 2s infinite;
`;

export default bulletsSkeleton;
