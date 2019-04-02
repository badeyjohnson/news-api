exports.createLookup = (arr, key, value) => {
  return arr.reduce((obj, item) => {
    obj[item[key]] = item[value];
    return obj;
  }, {});
};

exports.replaceKey = (arr, lookupObj, keyToRemove, keyToAdd) => {
  return arr.map((item) => {
    item[keyToAdd] = lookupObj[item[keyToRemove]];
    delete item[keyToRemove];
    return item;
  });
};