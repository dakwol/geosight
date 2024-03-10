type Data = {
  [key: string]: Data | Data[] | string | undefined;
};

export const updateDataKey = (data: Data, keyPath: string[], value: any): Data => {
  if (keyPath.length === 1) {
    data[keyPath[0]] = value;
  } else if (keyPath.length > 1) {
    const nextKey = keyPath.shift() || 0;
    if (data[nextKey] === undefined) {
      if (nextKey === 'post_content') {
        data[nextKey] = [];
      } else {
        data[nextKey] = {};
      }
    }
    if (typeof data[nextKey] === 'object') {
      updateDataKey(data[nextKey] as Data, keyPath, value);
    }
  }
  return data;
};
