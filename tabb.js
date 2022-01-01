import { PAGES_KEY, STORAGE_AREA } from './common/config.js';
import { getData, onChanged } from './api/storageAPI.js';
import { load, loadPage } from './common/feature.js';
import { createElement, selectElement } from './common/dom.js';

// =============== function ===============

// containers
const PagesContainer = selectElement('#pages');
const groupsMap = new Map();

const createPageEl = (page) => {
  const pageEl = document.createElement('div');
  pageEl.classList.add('page');
  // alt="${DEFAULT_FAVICON}"
  pageEl.innerHTML = `
    <img
      src="${page.icon}"
    />
    <span>${page.title}</span>
  `;
  pageEl.addEventListener('click', async () => {
    await loadPage(page);
  });

  return pageEl;
};

const createGroupEl = (group) => {
  const groupEl = createElement('div', {
    class: 'group',
  });
  groupEl.innerHTML = `
    <div class="group-info">
      <div class="title">Web 前端学习</div>
      <div class="page-count">${group.pages.length}个分页</div>
      <div class="detail">
        <div class="create-time">创建于 2021/12/15 下午2:17:41</div>
        <div class="actions">
          <div class="recoverAll">恢复全部</div>
          <div class="removeAll disabled">删除全部</div>
        </div>
      </div>
    </div>`;
  const recoverAllBtn = selectElement('.recoverAll', groupEl);
  recoverAllBtn.addEventListener('click', () => {
    load(group);
  });

  // pages
  group.pages.forEach((page) => {
    const pageEl = createPageEl(page);
    groupEl.appendChild(pageEl);
  });

  return groupEl;
};

/**
 * 渲染 pages
 */
const renderGroup = (group) => {
  console.log('[renderGroup] group', group);

  if (groupsMap.has(group.id)) {
    console.log('[renderGroup] fastforward');
    return;
  }

  const groupEl = createGroupEl(group);

  PagesContainer.appendChild(groupEl);
  groupsMap.set(group.id, groupEl);
};

const renderGroups = (groups = []) => {
  // console.log('[renderGroups] groups', groups);
  groups.forEach((group) => {
    renderGroup(group);
  });
};

const removeGroups = () => {};

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
      renderGroups(newPagesData.groups);
    }
  });
})();
