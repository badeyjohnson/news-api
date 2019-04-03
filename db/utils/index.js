exports.createLookup = (arr, key, value) => {
  return arr.reduce((obj, item) => {
    obj[item[key]] = item[value];
    return obj;
  }, {});
};

exports.replaceKey = (arr, lookupObj, keyToRemove, keyToAdd) => {
  return arr.map((item) => {
    const newItem = { ...item };
    newItem[keyToAdd] = lookupObj[item[keyToRemove]];
    delete newItem[keyToRemove];
    return newItem;
  });
};

exports.dateFormat = (unixMillisecs) => {
  return new Date(unixMillisecs);
};
