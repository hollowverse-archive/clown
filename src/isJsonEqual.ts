import _ from 'lodash';

export function isJsonEqual(json1: string, json2: string) {
  try {
    const jsonObj1 = JSON.parse(json1);
    const jsonObj2 = JSON.parse(json2);

    return _.isEqual(jsonObj1, jsonObj2);
  } catch (e) {
    return false;
  }
}
