// =============== tabs api ===============
/**
 * 查询 tabs
 */
export const queryTabs = async ({
  currentWindow = true, // 默认查询当前视窗
  pinned, // 默认不指定
}) => {
  return await chrome.tabs.query({
    currentWindow,
    pinned,
  });
};

/**
 * 获取指定 tab
 */
export const getTab = async (tabId) => {
  return await chrome.tabs.get(tabId);
};

/**
 * 跳转到目标 tab
 * tabs.highlight
 */
export const highlightTab = async ({
  tabs = [], // 目标 tabs 下标
  windowId, // 默认当前 window
}) => {
  return await chrome.tabs.highlight({
    tabs,
    windowId,
  });
};

/**
 * 创建 tab 页面
 * @param {*} param0
 * @returns
 */
export const createTab = async ({
  url, // 目标页面路径
  pinned = false, // 默认打开不置顶 tab
}) => {
  return await chrome.tabs.create({
    url,
    pinned,
  });
};
