export const getFromLs = (key: string) => {
  const lsVal = window.localStorage.getItem(key);
  if (!lsVal) {
    return null;
  }

  try {
    return JSON.parse(lsVal);
  } catch (e) {
    console.error(`Error parsing ${key} value`);
    return null;
  }
};

export const setToLs = (key: string, val: any) => {
  window.localStorage.setItem(key, JSON.stringify(val));
};

export const deleteFromLs = (key: string) => {
  window.localStorage.removeItem(key);
};