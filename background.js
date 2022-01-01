import { onInstalled } from './api/runtimeAPI.js';
import { PAGES_KEY } from './common/config.js';
import { setData } from './api/storageAPI.js';
import { onClicked } from './api/actionAPI.js';
import { queryTabs } from './api/tabsAPI.js';
import { dump, showTabb } from './common/feature.js';
import {
  addContextMenuListener,
  createContextMenu,
} from './api/contextMenusAPI.js';

// =============== function ===============

// =============== listener ===============
onClicked(async () => {
  const tabs = await queryTabs({ pinned: false });
  await showTabb();
  await dump(tabs);
});

// =============== lifecycle ===============
/**
 * onInstalled 时初始化存储空间
 */
onInstalled(async () => {
  // set context menus
  const openerId = 'opener';
  await createContextMenu({
    id: openerId,
    title: '打开 Tabb',
  });

  addContextMenuListener(openerId, async () => {
    console.log('打开 one tab');
    await showTabb();
  });

  // reset pages
  const defaultPagesData = {
    _groupId: 0,
    groups: [],
  };
  await setData(PAGES_KEY, defaultPagesData);
});
