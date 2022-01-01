// =============== chrome.action api ===============
/**
 * 插件操作全局监听函数
 * @param {*} cb
 */
export const onClicked = (cb) => {
  chrome.action.onClicked.addListener(cb);
};
