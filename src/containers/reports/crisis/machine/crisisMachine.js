import { Machine } from 'xstate';

function isPatrol(context) {
  return (context.role === 'patrol');
}

const crisisMachine = Machine(
  {
    id: 'step',
    initial: 'one',
    context: {
      role: 'clinician'
    },
    states: {
      1: {
        on: { NEXT: '1' }
      },
      2: {
        on: {
          '': {
            target: '3',
            cond: 'isPatrol'
          },
          NEXT: '3',
          PREV: '1'
        }
      },
      3: {
        type: 'final',
        on: { PREV: '2' }
      }
    },
  },
  {
    guards: {
      isPatrol
    }
  }
);

export {
  crisisMachine
};
