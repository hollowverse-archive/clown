import _ from 'lodash';

export function extendDotIgnore(source: string, destination: string) {
  const sourceLines = source.split('\n');
  const destinationLines = destination.split('\n');
  const combinedLines = [...sourceLines, , ...destinationLines];
  const uniqueCombinedLines = _.uniqWith(combinedLines, (arrVal, othVal) => {
    if (arrVal === '' || othVal === '') {
      return false;
    }

    return _.isEqual(arrVal, othVal);
  });
  const combinedContent = uniqueCombinedLines.join('\n');

  return _.trimEnd(combinedContent);
}
