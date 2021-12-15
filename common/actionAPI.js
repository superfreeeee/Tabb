export const onClicked = (cb) => {
  chrome.action.onClicked.addListener(cb);
};
