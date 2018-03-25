import _ from 'lodash';

export function extendDotIgnore(source: string, destination: string) {
  const sourceLines = source.split('\n');
  const destinationLines = destination.split('\n');

  return _.uniqWith(
    [...sourceLines, , ...destinationLines],
    (arrVal, othVal) => {
      if (arrVal === '' || othVal === '') {
        return false;
      }

      return _.isEqual(arrVal, othVal);
    },
  ).join('\n');
}
