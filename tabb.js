import { LAYOUT_MODE_KEY, PAGES_KEY, STORAGE_AREA } from './common/config.js';
import { getData, onChanged, setData } from './api/storageAPI.js';
import { load, loadPage } from './common/feature.js';
import { createElement, createText, selectElement } from './common/dom.js';

// =============== layout mode ===============
// bind with .__tabb_layout_options > div keys
const LAYOUT_MODE = {
  List: 'list',
  Card: 'card',
  Single: 'single',
};
let layoutMode = null;

const setLayoutMode = (mode) => {
  if (layoutMode === mode) {
    return;
  }
  const modeBtn = (m) => `.__tabb_layout_options > div[key=${m}]`;

  // update btn class
  selectElement(modeBtn(layoutMode))?.classList.toggle('active');
  selectElement(modeBtn(mode))?.classList.toggle('active');

  // sync storage
  layoutMode = mode;
  setData(LAYOUT_MODE_KEY, mode);
};

// =============== menu control ===============
const MENU_ITEMS = [
  { type: 'pages', title: '全部标签页' },
  { type: 'tag', filter: 'default', title: '默认标签' },
  { type: 'options', title: '设置' },
];
let activeMenuItem = null;

const menuItemKey = (item) => {
  if (!item) {
    return '_';
  }
  switch (item.type) {
    case 'tag':
      return `${item.type}_${item.filter}`;
    case 'pages':
    case 'options':
      return `${item.type}`;
  }
};

const activateMenuItem = (item) => {
  if (activeMenuItem === item) {
    return;
  }
  const getSelector = (item) =>
    `.__tabb_menu > .__tabb_menu_item[key=${menuItemKey(item)}]`;
  selectElement(getSelector(activeMenuItem))?.classList.toggle('active');
  selectElement(getSelector(item))?.classList.toggle('active');

  activeMenuItem = item;
};

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
  // load pages data
  const pagesData = await getData(PAGES_KEY);
  // TODO clear console
  console.log('pagesData', pagesData);
  renderGroups(pagesData.groups);

  // init menu selection
  const MenuContainer = selectElement('.__tabb_menu');
  MENU_ITEMS.forEach((item) => {
    // create options
    const option = createElement(
      'li',
      {
        class: '__tabb_menu_item',
        key: menuItemKey(item),
      },
      createText(item.title)
    );
    option.addEventListener('click', () => {
      activateMenuItem(item);
    });
    MenuContainer.appendChild(option);
  });
  activateMenuItem(MENU_ITEMS[0]);

  // init layout mode
  getData(LAYOUT_MODE_KEY, LAYOUT_MODE.List).then((mode) => {
    setLayoutMode(mode);
    console.log(`[onLoad] recent mode = ${mode}`);
  });
  selectElement('.__tabb_layout_options > div', true).forEach((btn) => {
    const mode = btn.getAttribute('key');
    btn.addEventListener('click', () => {
      setLayoutMode(mode);
    });
  });

  // listen storage change
  onChanged((changes, areaName) => {
    // TODO clear console
    const changesKey = Object.keys(changes).join(',');
    console.log(`[storage.onChnage] area=${areaName}, changes=${changesKey}`);

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
