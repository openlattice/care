import { Machine, assign } from 'xstate';

function isPatrol(context) {
  return (context.role === 'patrol');
}

const stackIsNotEmpty = (ctx) => ctx.stack.length > 0;

const pushToStack = assign({
  stack: (ctx, e, action) => {
    return ctx.stack.concat(ctx.question);
  }
});

const nextPage = assign({
  question: (ctx, e) => e.question,
  stack: (ctx) => ctx.stack.concat(ctx.question)
});

const prevPage = assign((ctx) => {
  const { stack } = ctx;
  const newStack = stack.slice(0, stack.length - 1);
  const prev = stack[stack.length - 1];

  return {
    question: prev,
    stack: newStack
  };
});

const crisisMachine = Machine(
  {
    id: 'step',
    initial: 'profile',
    context: {
      role: 'clinician',
      stack: [],
      question: 'profile'
    },
    states: {
      profile: {
        entry: 'pushToStack',
        on: {
          NEXT: 'incident',
        }
      },
      incident: {
        on: {
          NEXT: 'behavior',
          PREV: 'profile'
        }
      },
      behavior: {
        on: {
          NEXT: 'medical',
          PREV: 'incident'
        }
      },
      medical: {
        on: {
          '': {
            target: 'threat',
            cond: 'isPatrol'
          },
          NEXT: 'threat',
          PREV: 'behavior'
        }
      },
      threat: {
        on: {
          NEXT: 'housingAndEmployment',
          PREV: 'medical'
        }
      },
      housingAndEmployment: {
        on: {
          NEXT: 'insurance',
          PREV: 'threat'
        }
      },
      insurance: {
        // type: 'final',
        on: { PREV: 'housingAndEmployment' }
      }
    },
  },
  {
    actions: {
      nextPage,
      prevPage,
      pushToStack,
    },
    guards: {
      isPatrol,
      stackIsNotEmpty
    }
  }
);

export {
  crisisMachine
};
