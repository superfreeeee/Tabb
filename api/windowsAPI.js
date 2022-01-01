// =============== chrome.windows api ===============
/**
 * 创建新的视窗
 */
export const createWindow = async ({ url } = {}) => {
  return await chrome.windows.create({
    url,
  });
};
