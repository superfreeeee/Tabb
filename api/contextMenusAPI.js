// =============== chrome.contextMenus api ===============
/**
 * 在右键列表创建一个选项
 * @param {*} param0
 * @returns
 */
export const createContextMenu = async ({ id, title, parentId } = {}) => {
  return await chrome.contextMenus.create({
    id,
    title,
    parentId,
    contexts: ['all'],
  });
};

/**
 * 添加 contextMenu 点击回调
 * @param {*} cb
 * @param {*} targetId
 */
// id : callback
const contextMenuListeners = new Map();
const DEFAULT_LISTENER_KEY = '__default';
let contextMenuListenerSet = false;
export const addContextMenuListener = (targetId, cb) => {
  if (!contextMenuListenerSet) {
    // set listener
    chrome.contextMenus.onClicked.addListener((item, tab) => {
      const itemId = item.menuItemId;
      const callbacks = contextMenuListeners.get(DEFAULT_LISTENER_KEY) || [];
      if (contextMenuListeners.has(itemId)) {
        callbacks.push(...contextMenuListeners.get(itemId));
      }

      callbacks.forEach((cb) => {
        cb(item, tab);
      });
    });
  }

  // add callback
  if (typeof targetId === 'function') {
    // addContextMenuListener(cb)
    cb = targetId;
    targetId = DEFAULT_LISTENER_KEY;
  }
  const callbacks = contextMenuListeners.get(targetId) || [];
  if (!contextMenuListeners.has(targetId)) {
    contextMenuListeners.set(targetId, callbacks);
  }
  callbacks.push(cb);
};
