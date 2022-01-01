import { STORAGE_AREA } from '../common/config.js';

// =============== chrome.storage api ===============
/**
 * 获取数据
 */
export const getData = async (key, defaultValue) => {
  const { [key]: data } = await chrome.storage[STORAGE_AREA].get(key);
  if (!data) {
    console.log(`[getData] key=${key}, data=${data}  => using defaultValue`);
  }
  return data || defaultValue;
};

/**
 * 设置数据
 * @param {*} key
 * @param {*} data
 * @returns
 */
export const setData = async (key, data) => {
  return await chrome.storage[STORAGE_AREA].set({ [key]: data });
};

/**
 * 移除数据
 */
export const removeData = async (key) => {
  return await chrome.storage[STORAGE_AREA].remove(key);
};

/**
 * 监听 storage 变化
 */
export const onChanged = async (cb) => {
  chrome.storage.onChanged.addListener(cb);
};
