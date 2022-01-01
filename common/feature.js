import { noUnpinnedTabs } from '../api/tabsAPI.js';
import { getData, setData } from '../api/storageAPI.js';
import { createTab, highlightTab, queryTabs } from '../api/tabsAPI.js';
import { createWindow } from '../api/windowsAPI.js';
import { MAIN_PAGE_URL, PAGES_KEY } from './config.js';
import { transformTabsGroup } from './data.js';

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
  pagesData.groups.push(transformTabsGroup(tabs, ++_groupId));
  pagesData._groupId = _groupId;

  await setData(PAGES_KEY, pagesData);
};

/**
 * 恢复指定 group
 * @param {Object} group
 * @returns
 */
export const load = async (group) => {
  console.log(`[load] tabs`, group.pages);
  if (!group) {
    return;
  }

  const tabs = [];
  if (await noUnpinnedTabs()) {
    for (const { url } of group.pages) {
      tabs.push(await createTab({ url }));
    }
  } else {
    console.log(`[load] create new window`);
    const pagesUrl = group.pages.map((page) => page.url);
    await createWindow({ url: pagesUrl });
  }
};

/**
 * 恢复指定页面
 * @param {Object|string} page
 * @returns
 */
export const loadPage = async (page) => {
  if (!page) {
    return;
  }
  const url = typeof page === 'object' ? page.url : page;
  await createTab({ url });
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
    await createTab({ url: MAIN_PAGE_URL, pinned: true, active: true });
  }
};
