/**
 * @file storage 工具库
 * @description 高级的本地存储工具库，支持 sessionStorage 和 localStorage 操作，封装常用的获取、设置、删除、清空等功能。
 * 使用方法：storage.get({ type, name, item });
 *           storage.set({ type, name, item, value });
 *           storage.remove({ type, name, item });
 *           storage.clear({ type });
 * 
 * 提供链式调用，支持灵活存储结构处理。
 */

const StorageUtil = (() => {
  // 辅助函数：检查是否存在必需的参数
  const ensureParams = (requiredParams, props) => {
    requiredParams.forEach((param) => {
      if (!props[param]) {
        throw new Error(`缺少参数: ${param}`);
      }
    });
  };

  const get = ({ type, name, item }) => {
    ensureParams(["type", "name"], { type, name });
    const storage = window[type + "Storage"];
    const storedData = JSON.parse(storage.getItem(name) || "{}");
    return item ? storedData[item] : storedData;
  };

  const set = ({ type, name, item, value }) => {
    ensureParams(["type", "name", "value"], { type, name, value });
    const storage = window[type + "Storage"];
    let storedData = JSON.parse(storage.getItem(name) || "{}");
    if (item) {
      storedData[item] = value;
    } else {
      storedData = value;
    }
    storage.setItem(name, JSON.stringify(storedData));
  };

  const remove = ({ type, name, item }) => {
    ensureParams(["type", "name"], { type, name });
    const storage = window[type + "Storage"];
    if (item) {
      const storedData = JSON.parse(storage.getItem(name) || "{}");
      delete storedData[item];
      storage.setItem(name, JSON.stringify(storedData));
    } else {
      storage.removeItem(name);
    }
  };

  const clear = ({ type }) => {
    ensureParams(["type"], { type });
    const storage = window[type + "Storage"];
    storage.clear();
  };

  const chain = ({ type, name }) => {
    const storage = window[type + "Storage"];
    return {
      get: (item) => {
        const storedData = JSON.parse(storage.getItem(name) || "{}");
        return item ? storedData[item] : storedData;
      },
      set: (item, value) => {
        let storedData = JSON.parse(storage.getItem(name) || "{}");
        storedData[item] = value;
        storage.setItem(name, JSON.stringify(storedData));
        return this;
      },
      remove: (item) => {
        const storedData = JSON.parse(storage.getItem(name) || "{}");
        delete storedData[item];
        storage.setItem(name, JSON.stringify(storedData));
        return this;
      },
      clear: () => {
        storage.removeItem(name);
        return this;
      },
    };
  };

  return {
    get,
    set,
    remove,
    clear,
    chain,
  };
})();

export default StorageUtil;
