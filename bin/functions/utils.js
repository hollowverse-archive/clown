"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
function isArrayOfObjects(value) {
    return _.isArray(value) && _.every(value, _.isObject);
}
exports.isArrayOfObjects = isArrayOfObjects;
function keyIsPotentialId(arrayOfObjects, key) {
    const valuesOfKey = arrayOfObjects.map((obj) => obj[key]);
    return (isArrayOfStrings(valuesOfKey) &&
        _.uniq(valuesOfKey).length === arrayOfObjects.length);
}
exports.keyIsPotentialId = keyIsPotentialId;
function isArrayOfStrings(value) {
    return _.isArray(value) && _.every(value, _.isString);
}
exports.isArrayOfStrings = isArrayOfStrings;
function guessKeyWithUniqueValue(records) {
    const sampleRecord = records[0];
    const potentialKeys = _.mapValues(sampleRecord, (_1, key) => keyIsPotentialId(records, key));
    const key = _.findKey(potentialKeys);
    if (key === undefined) {
        throw new Error(`Could not guess record ID. Example record: ${JSON.stringify(sampleRecord)}`);
    }
    return key;
}
exports.guessKeyWithUniqueValue = guessKeyWithUniqueValue;
function isArrayOfUnmergeables(arr) {
    return _.isArray(arr) && _.every(arr, isUnmergeable);
}
exports.isArrayOfUnmergeables = isArrayOfUnmergeables;
function isUnmergeable(value) {
    return _.some([
        _.isString,
        _.isBoolean,
        _.isBuffer,
        _.isDate,
        _.isEmpty,
        _.isError,
        _.isFinite,
        _.isFunction,
        _.isInteger,
        _.isNaN,
        _.isNil,
        _.isNull,
        _.isNumber,
        _.isRegExp,
        _.isSymbol,
        _.isUndefined,
    ], fn => fn(value));
}
exports.isUnmergeable = isUnmergeable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL21rL0NvZGUvZ2l0aHViL3dob2xlc29tZWRldi9leHRlbmQtY29uZmlnL3NyYy8iLCJzb3VyY2VzIjpbImZ1bmN0aW9ucy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFFNUIsMEJBQWlDLEtBQVk7SUFDM0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFGRCw0Q0FFQztBQUVELDBCQUFpQyxjQUF3QixFQUFFLEdBQVc7SUFDcEUsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFL0QsTUFBTSxDQUFDLENBQ0wsZ0JBQWdCLENBQUMsV0FBVyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxLQUFLLGNBQWMsQ0FBQyxNQUFNLENBQ3JELENBQUM7QUFDSixDQUFDO0FBUEQsNENBT0M7QUFFRCwwQkFBaUMsS0FBWTtJQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQUZELDRDQUVDO0FBRUQsaUNBQXdDLE9BQWlCO0lBQ3ZELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxNQUFNLGFBQWEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUMxRCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQy9CLENBQUM7SUFFRixNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRXJDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQ2IsOENBQThDLElBQUksQ0FBQyxTQUFTLENBQzFELFlBQVksQ0FDYixFQUFFLENBQ0osQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQWpCRCwwREFpQkM7QUFFRCwrQkFBc0MsR0FBVTtJQUM5QyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRkQsc0RBRUM7QUFFRCx1QkFBOEIsS0FBVTtJQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDWDtRQUNFLENBQUMsQ0FBQyxRQUFRO1FBQ1YsQ0FBQyxDQUFDLFNBQVM7UUFDWCxDQUFDLENBQUMsUUFBUTtRQUNWLENBQUMsQ0FBQyxNQUFNO1FBQ1IsQ0FBQyxDQUFDLE9BQU87UUFDVCxDQUFDLENBQUMsT0FBTztRQUNULENBQUMsQ0FBQyxRQUFRO1FBQ1YsQ0FBQyxDQUFDLFVBQVU7UUFDWixDQUFDLENBQUMsU0FBUztRQUNYLENBQUMsQ0FBQyxLQUFLO1FBQ1AsQ0FBQyxDQUFDLEtBQUs7UUFDUCxDQUFDLENBQUMsTUFBTTtRQUNSLENBQUMsQ0FBQyxRQUFRO1FBQ1YsQ0FBQyxDQUFDLFFBQVE7UUFDVixDQUFDLENBQUMsUUFBUTtRQUNWLENBQUMsQ0FBQyxXQUFXO0tBQ2QsRUFDRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FDaEIsQ0FBQztBQUNKLENBQUM7QUF0QkQsc0NBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheU9mT2JqZWN0cyh2YWx1ZTogYW55W10pOiB2YWx1ZSBpcyBvYmplY3RbXSB7XG4gIHJldHVybiBfLmlzQXJyYXkodmFsdWUpICYmIF8uZXZlcnkodmFsdWUsIF8uaXNPYmplY3QpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24ga2V5SXNQb3RlbnRpYWxJZChhcnJheU9mT2JqZWN0czogb2JqZWN0W10sIGtleTogc3RyaW5nKSB7XG4gIGNvbnN0IHZhbHVlc09mS2V5ID0gYXJyYXlPZk9iamVjdHMubWFwKChvYmo6IGFueSkgPT4gb2JqW2tleV0pO1xuXG4gIHJldHVybiAoXG4gICAgaXNBcnJheU9mU3RyaW5ncyh2YWx1ZXNPZktleSkgJiZcbiAgICBfLnVuaXEodmFsdWVzT2ZLZXkpLmxlbmd0aCA9PT0gYXJyYXlPZk9iamVjdHMubGVuZ3RoXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5T2ZTdHJpbmdzKHZhbHVlOiBhbnlbXSk6IHZhbHVlIGlzIHN0cmluZ1tdIHtcbiAgcmV0dXJuIF8uaXNBcnJheSh2YWx1ZSkgJiYgXy5ldmVyeSh2YWx1ZSwgXy5pc1N0cmluZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBndWVzc0tleVdpdGhVbmlxdWVWYWx1ZShyZWNvcmRzOiBvYmplY3RbXSkge1xuICBjb25zdCBzYW1wbGVSZWNvcmQgPSByZWNvcmRzWzBdO1xuICBjb25zdCBwb3RlbnRpYWxLZXlzID0gXy5tYXBWYWx1ZXMoc2FtcGxlUmVjb3JkLCAoXzEsIGtleSkgPT5cbiAgICBrZXlJc1BvdGVudGlhbElkKHJlY29yZHMsIGtleSksXG4gICk7XG5cbiAgY29uc3Qga2V5ID0gXy5maW5kS2V5KHBvdGVudGlhbEtleXMpO1xuXG4gIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBDb3VsZCBub3QgZ3Vlc3MgcmVjb3JkIElELiBFeGFtcGxlIHJlY29yZDogJHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgc2FtcGxlUmVjb3JkLFxuICAgICAgKX1gLFxuICAgICk7XG4gIH1cblxuICByZXR1cm4ga2V5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheU9mVW5tZXJnZWFibGVzKGFycjogYW55W10pIHtcbiAgcmV0dXJuIF8uaXNBcnJheShhcnIpICYmIF8uZXZlcnkoYXJyLCBpc1VubWVyZ2VhYmxlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVW5tZXJnZWFibGUodmFsdWU6IGFueSkge1xuICByZXR1cm4gXy5zb21lKFxuICAgIFtcbiAgICAgIF8uaXNTdHJpbmcsXG4gICAgICBfLmlzQm9vbGVhbixcbiAgICAgIF8uaXNCdWZmZXIsXG4gICAgICBfLmlzRGF0ZSxcbiAgICAgIF8uaXNFbXB0eSxcbiAgICAgIF8uaXNFcnJvcixcbiAgICAgIF8uaXNGaW5pdGUsXG4gICAgICBfLmlzRnVuY3Rpb24sXG4gICAgICBfLmlzSW50ZWdlcixcbiAgICAgIF8uaXNOYU4sXG4gICAgICBfLmlzTmlsLFxuICAgICAgXy5pc051bGwsXG4gICAgICBfLmlzTnVtYmVyLFxuICAgICAgXy5pc1JlZ0V4cCxcbiAgICAgIF8uaXNTeW1ib2wsXG4gICAgICBfLmlzVW5kZWZpbmVkLFxuICAgIF0sXG4gICAgZm4gPT4gZm4odmFsdWUpLFxuICApO1xufVxuIl19