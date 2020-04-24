/*
 * @flow
 */

import { OrderedMap } from 'immutable';

const GENERATOR_FUNCTION_TAG = '[object GeneratorFunction]';
// const GENERATOR_TAG = '[object Generator]';
// const OBJECT_TAG = '[object Object]';
// const STRING_TAG = '[object String]';

function testShouldBeGeneratorFunction(fnToTest :Function) {

  test('should be a generator function', () => {
    expect(Object.prototype.toString.call(fnToTest)).toEqual(GENERATOR_FUNCTION_TAG);
  });
}

function testShouldBeRequestSequenceFunction(fnToTest :Function, baseType :string) {

  test('should be a RequestSequence function', () => {

    expect(fnToTest).toBeInstanceOf(Function);
    expect(fnToTest.REQUEST).toEqual(`${baseType}/REQUEST`);
    expect(fnToTest.SUCCESS).toEqual(`${baseType}/SUCCESS`);
    expect(fnToTest.FAILURE).toEqual(`${baseType}/FAILURE`);
    expect(fnToTest.FINALLY).toEqual(`${baseType}/FINALLY`);
    expect(fnToTest.request).toBeInstanceOf(Function);
    expect(fnToTest.success).toBeInstanceOf(Function);
    expect(fnToTest.failure).toBeInstanceOf(Function);
    expect(fnToTest.finally).toBeInstanceOf(Function);
    expect(fnToTest.case).toBeInstanceOf(Function);
    expect(fnToTest.reducer).toBeInstanceOf(Function);
  });
}

function testShouldExportActionTypes(Actions :Object, expectedActionTypes :string[]) {

  describe('should export action types', () => {

    test('should export expected action types, sorted alphabetically', () => {
      const exportedActionTypes = OrderedMap(Actions).filter((v, k) => expectedActionTypes.includes(k));
      expect(exportedActionTypes.keySeq().toJS()).toEqual(expectedActionTypes);
      expect(exportedActionTypes.valueSeq().toJS()).toEqual(expectedActionTypes);
    });

    expectedActionTypes.forEach((actionType) => {
      test(`should export "${actionType}"`, () => {
        expect(Actions).toHaveProperty(actionType);
        expect(Actions[actionType]).toEqual(actionType);
      });
    });
  });
}

function testShouldExportRequestSequences(
  Actions :Object,
  expectedActionTypes :string[],
  expectedReqSeqNames :string[],
) {

  describe('should export RequestSequences', () => {

    test('should export expected RequestSequences, sorted alphabetically', () => {
      const expectedReqSeqs = OrderedMap(Actions).filter((v, k) => expectedReqSeqNames.includes(k));
      expect(expectedReqSeqs.keySeq().toJS()).toEqual(expectedReqSeqNames);
    });

    expectedReqSeqNames.forEach((reqseqName, index) => {
      describe(`${reqseqName}`, () => {
        const expectedActionType = expectedActionTypes[index];
        testShouldBeRequestSequenceFunction(Actions[reqseqName], Actions[expectedActionType]);
      });
    });
  });
}

export {
  testShouldBeGeneratorFunction,
  testShouldBeRequestSequenceFunction,
  testShouldExportActionTypes,
  testShouldExportRequestSequences,
};
