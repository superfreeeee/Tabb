import { onClicked } from './common/actionAPI.js';
import { PAGES_KEY } from './common/config.js';
import { dump, showTabb } from './common/feature.js';
import { onInstalled } from './common/runtimeAPI.js';
import { setData } from './common/storageAPI.js';

// =============== function ===============

// =============== listener ===============
onClicked(async () => {
  await showTabb();
  await dump();
});

// =============== lifecycle ===============
/**
 * onInstalled
 */
onInstalled(async () => {
  // reset pages
  const defaultPagesData = {
    _groupId: 0,
    groups: [],
  };
  await setData(PAGES_KEY, defaultPagesData);
});
