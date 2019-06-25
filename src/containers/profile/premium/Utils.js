// @flow
import { Models } from 'lattice';
import { List, Map } from 'immutable';

const { FullyQualifiedName } = Models;

const countPropertyOccurrance = (reports :List<Map>, propertyTypeFqn :FullyQualifiedName) => Map()
  .withMutations((mutable) => {
    reports.forEach((report) => {
      const propertyValues = report.get(propertyTypeFqn, []);

      propertyValues.forEach((value) => {
        if (value) {
          if (mutable.has(value)) {
            mutable.update(value, count => count + 1);
          }
          else {
            mutable.set(value, 1);
          }
        }
      });
    });
  });

export {
  countPropertyOccurrance
};
