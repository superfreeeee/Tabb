const __element_cache = new Map();

/**
 * 注册组件
 * @param {string|Symbol} name
 * @param {string} tagName
 * @param {Object} attrs
 * @param {Array} children
 */
export const defineComponent = (name, tagName, attrs, children) => {
  const props = [tagName, attrs, children];
  const type = typeof name === 'string' ? Symbol.for(name) : name;
  __element_cache.set(name, props);
  return type;
};

/**
 * 创建已定义组件
 * @param {string|Symbol} type
 * @returns
 */
export const createComponent = (type) => {
  if (typeof type === 'string') {
    type = Symbol.for(type);
  }
  if (!__element_cache.has(type)) {
    throw new ReferenceError(`undefined component type ${type}`);
  }
  const props = __element_cache.get(type);
  return createElement(...props);
};

/**
 * 创建元素
 * @param {string} tagName
 * @param {Object} attrs
 * @param {HTMLElement|HTMLElement[]} children
 * @returns
 */
export const createElement = (tagName, attrs = {}, children = []) => {
  const el = document.createElement(tagName);
  for (const prop in attrs) {
    el.setAttribute(prop, attrs[prop]);
  }
  if (!Array.isArray(children)) {
    children = [children];
  }
  children.forEach((child) => {
    el.appendChild(child);
  });
  return el;
};

/**
 * 创建文本节点
 * @param {string} text
 * @returns
 */
export const createText = (text) => {
  return document.createTextNode(text);
};

/**
 * 选择指定元素
 * @param {string} selector
 * @param {boolean} selectAll
 * @returns
 */
export const selectElement = (
  selector,
  container = document,
  selectAll = false
) => {
  if (typeof selector !== 'string') {
    throw new TypeError(`selector must be string, got ${typeof selector}`);
  }
  // selectElement(selector, selectAll)
  if (typeof container === 'boolean') {
    selectAll = container;
    container = document;
  }

  if (selectAll) {
    return container.querySelectorAll(selector);
  } else {
    return container.querySelector(selector);
  }
};
