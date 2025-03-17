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

type StorageType = 'local' | 'session'; // 定义存储类型，localStorage 或 sessionStorage

interface StorageProps {
  type: StorageType;  // 存储类型
  name: string;       // 存储项名称
  item?: string;      // 存储项内的具体字段
  value?: any;        // 要设置的值
}

const StorageUtil = (() => {
  // 辅助函数：检查是否存在必需的参数
  const ensureParams = (requiredParams: string[], props: StorageProps) => {
    requiredParams.forEach((param) => {
      if (!props[param]) {
        throw new Error(`缺少参数: ${param}`);
      }
    });
  };

  /**
   * 获取存储中的数据
   * @param {StorageProps} props - 包含存储类型、名称以及可选的项名
   * @returns {any} 返回存储的值，支持获取整个对象或指定项
   */
  const get = ({ type, name, item }: StorageProps): any => {
    ensureParams(['type', 'name'], { type, name });
    const storage = window[type + 'Storage']; // 使用 window 来动态选择 sessionStorage 或 localStorage
    const storedData = JSON.parse(storage.getItem(name) || '{}');
    return item ? storedData[item] : storedData; // 如果指定了 item，返回项的值，否则返回整个存储的对象
  };

  /**
   * 设置存储中的数据
   * @param {StorageProps} props - 包含存储类型、名称、项名及值
   */
  const set = ({ type, name, item, value }: StorageProps): void => {
    ensureParams(['type', 'name', 'value'], { type, name, value });
    const storage = window[type + 'Storage'];
    let storedData = JSON.parse(storage.getItem(name) || '{}');
    if (item) {
      storedData[item] = value;  // 如果指定了 item，则设置该项的值
    } else {
      storedData = value;  // 如果没有指定 item，则直接设置值
    }
    storage.setItem(name, JSON.stringify(storedData));  // 存储更新后的数据
  };

  /**
   * 删除存储中的某个项
   * @param {StorageProps} props - 包含存储类型、名称和可选项名
   */
  const remove = ({ type, name, item }: StorageProps): void => {
    ensureParams(['type', 'name'], { type, name });
    const storage = window[type + 'Storage'];
    if (item) {
      const storedData = JSON.parse(storage.getItem(name) || '{}');
      delete storedData[item];  // 删除指定项
      storage.setItem(name, JSON.stringify(storedData));  // 更新存储
    } else {
      storage.removeItem(name);  // 如果没有指定项，直接删除整个项
    }
  };

  /**
   * 清空指定类型的所有存储
   * @param {StorageType} type - 指定存储类型，'local' 或 'session'
   */
  const clear = ({ type }: { type: StorageType }): void => {
    ensureParams(['type'], { type });
    const storage = window[type + 'Storage'];
    storage.clear();  // 清空存储的所有项
  };

  /**
   * 链式调用：获取、设置、删除或清空存储中的数据
   * @param {StorageProps} props - 操作存储的参数
   * @returns {StorageUtil} 返回当前的 StorageUtil 实例，支持链式调用
   */
  const chain = ({ type, name }: StorageProps) => {
    const storage = window[type + 'Storage'];
    return {
      // 获取值
      get: (item?: string) => {
        const storedData = JSON.parse(storage.getItem(name) || '{}');
        return item ? storedData[item] : storedData;
      },
      // 设置值
      set: (item: string, value: any) => {
        let storedData = JSON.parse(storage.getItem(name) || '{}');
        storedData[item] = value;
        storage.setItem(name, JSON.stringify(storedData));
        return this; // 支持链式调用
      },
      // 删除值
      remove: (item: string) => {
        const storedData = JSON.parse(storage.getItem(name) || '{}');
        delete storedData[item];
        storage.setItem(name, JSON.stringify(storedData));
        return this; // 支持链式调用
      },
      // 清空存储项
      clear: () => {
        storage.removeItem(name);
        return this; // 支持链式调用
      }
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
