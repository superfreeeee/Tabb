// =============== chrome.runtime api ===============
/**
 * 运行时 onInstalled 钩子
 * @param {*} cb 
 */
export const onInstalled = (cb) => {
  chrome.runtime.onInstalled.addListener(cb);
};
