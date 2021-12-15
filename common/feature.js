import { MAIN_PAGE_URL, PAGES_KEY } from './config.js';
import { getData, setData } from './storageAPI.js';
import { createTab, highlightTab, queryTabs } from './tabsAPI.js';

/**
 * 保存 Tabs
 *   默认保存当前页面所有 tabs
 */
export const dump = async (tabs) => {
  if (!tabs) {
    tabs = await queryTabs({ pinned: false });
  }

  const pagesData = await getData(PAGES_KEY);
  let _groupId = pagesData._groupId;
  pagesData.groups.push({
    id: ++_groupId,
    pages: tabs.map(({ title, url }) => ({ title, url })),
  });
  pagesData._groupId = _groupId;

  await setData(PAGES_KEY, pagesData);
};

/**
 * 恢复指定 tabs
 */
export const load = async (tabs) => {
  if (!tabs) {
    return;
  }
};

/**
 * 显示主页面 tabb.html
 */
export const showTabb = async () => {
  const pinnedTabs = await queryTabs({ pinned: true });
  const mainTabs = pinnedTabs.filter((tab) => tab.url.includes(MAIN_PAGE_URL));
  if (mainTabs.length) {
    const index = mainTabs[0].index;
    await highlightTab({ tabs: index });
  } else {
    await createTab({ url: MAIN_PAGE_URL, pinned: true });
  }
};
