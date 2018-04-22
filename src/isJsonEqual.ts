import _ from 'lodash';
import json5 from 'json5';

export function isJsonEqual(json1: string, json2: string) {
  try {
    const jsonObj1 = json5.parse(json1);
    const jsonObj2 = json5.parse(json2);

    return _.isEqual(jsonObj1, jsonObj2);
  } catch (e) {
    return false;
  }
}
