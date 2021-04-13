/*
 * @flow
 */

import { Map } from 'immutable';

export type SearchResultProps = {
  className ?:string;
  result :Map;
  resultColumns ?:number;
  resultLabels ?:Map;
  onClick ?:(result :Map) => void;
};
