/*
 * @flow
 */

type VisibilityTypesEnum = {|
  AUTO :'Auto';
  Auto :'Auto';
  PRIVATE :'Private';
  Private :'Private';
  PUBLIC :'Public';
  Public :'Public';
|};

const VisibilityTypes :{| ...VisibilityTypesEnum |} = Object.freeze({
  AUTO: 'Auto',
  Auto: 'Auto',
  PRIVATE: 'Private',
  Private: 'Private',
  PUBLIC: 'Public',
  Public: 'Public',
});

type VisibilityType = $Values<typeof VisibilityTypes>;

export default VisibilityTypes;
export type { VisibilityType };
