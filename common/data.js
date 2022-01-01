export const transformTabsGroup = (tabs, groupId) => {
  console.log('[transformTabsGroup] tabs', tabs);
  // 当前 tab
  let highlightedIndex = -1;
  // 标签列表
  const pages = tabs.map(({ favIconUrl, title, url, highlighted }, index) => {
    if (highlighted) {
      highlightedIndex = index;
    }
    return {
      icon: favIconUrl.replace(/-dark/, ''),
      title,
      url,
    };
  });

  return {
    id: groupId,
    pages,
    highlightedIndex,
    createTime: Date.now(),
  };
};
