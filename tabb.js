import { PAGES_KEY, STORAGE_AREA } from './common/config.js';
import { getData, onChanged } from './common/storageAPI.js';

// =============== function ===============

// containers
const PagesContainer = document.querySelector('#pages');
const groupsMap = new Map();

/**
 * 渲染 pages
 */
const renderGroup = (group = []) => {
  console.log('[renderGroup] group', group);

  if (groupsMap.has(group.id)) {
    console.log('[renderGroup] fastforward');
    return;
  }

  const groupContainer = document.createElement('div');
  groupContainer.classList.add('group');
  group.pages.forEach((page) => {
    const pageEl = document.createElement('div');
    pageEl.classList.add('page');
    pageEl.innerHTML = `
      <div>title: ${page.title}</div>
      <div>url: ${page.url}</div>
    `;
    groupContainer.appendChild(pageEl);
  });

  console.log('groupContainer', groupContainer);

  PagesContainer.appendChild(groupContainer);
  groupsMap.set(group.id, groupContainer);
};

const renderGroups = (groups = []) => {
  groups.forEach((group) => {
    renderGroup(group);
  });
};

(async function onLoad() {
  const pagesData = await getData(PAGES_KEY);
  console.log('pagesData', pagesData);
  renderGroups(pagesData.groups);

  onChanged((changes, areaName) => {
    console.group('onChange');
    console.log('changes', changes);
    console.log('areaName', areaName);
    console.groupEnd();

    if (areaName === STORAGE_AREA) {
      const pagesDataChanges = changes[PAGES_KEY];
      if (!pagesDataChanges) {
        return;
      }
      const { oldValue: oldPagesData, newValue: newPagesData } =
        pagesDataChanges;
      console.log('');
      renderGroups(newPagesData.groups);
    }
  });
  // add more page
  // const addBtn = document.querySelector('#add-more-page');
  // addBtn.addEventListener('click', async () => {
  //   console.log('click addBtn');
  //   const oldPages = await getPages();
  //   const newPages = [
  //     ...oldPages,
  //     'https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api/action',
  //   ];
  //   await setPages(newPages);
  // });
  // remove all page
  // const removeAllBtn = document.querySelector('#remove-all-pages');
  // removeAllBtn.addEventListener('click', async () => {
  //   await removePages();
  // });
  // const pages = await getPages();
  // renderPages(pages);
  // setStorageListener();
})();
