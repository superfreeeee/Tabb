export const onInstalled = (cb) => {
  chrome.runtime.onInstalled.addListener(cb);
};
