import { Machine } from 'xstate';

const isPatrol = (context) => {
  return (context.role === 'patrol');
};

const isClinician = (context) => {
  return (context.role === 'clinician');
};

const crisisMachine = Machine(
  {
    id: 'step',
    initial: 'profile',
    context: {
      role: 'clinician',
    },
    states: {
      profile: {
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
          NEXT: [
            { target: 'medical', cond: 'isClinician' },
            { target: 'threat' },
          ],
          PREV: 'incident'
        }
      },
      medical: {
        on: {
          NEXT: 'threat',
          PREV: 'behavior'
        }
      },
      threat: {
        on: {
          NEXT: 'housingAndEmployment',
          PREV: [
            { target: 'medical', cond: 'isClinician' },
            { target: 'behavior' },
          ]
        }
      },
      housingAndEmployment: {
        on: {
          NEXT: 'insurance',
          PREV: 'threat'
        }
      },
      insurance: {
        on: {
          NEXT: 'disposition',
          PREV: 'housingAndEmployment'
        }
      },
      disposition: {
        on: {
          NEXT: 'review',
          PREV: 'insurance'
        }
      },
      review: {
        on: {
          PREV: 'disposition'
        }
      }
    }
  },
  {
    guards: {
      isClinician,
      isPatrol
    }
  }
);

export {
  crisisMachine
};
