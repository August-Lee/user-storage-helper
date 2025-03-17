# 1 安装
```
npm install user-storage-helper
```

----------------------------------------------------------------------

# 2 介绍
```
适用于按用户级存取用户相关信息，可存储sessionStorage, localStorage
```

----------------------------------------------------------------------

# 3 用法介绍 API
```
import StorageUtil from './storageUtil';

// 获取整个存储对象
const user = StorageUtil.get({ type: 'local', name: 'userData' });

// 获取指定项
const userId = StorageUtil.get({ type: 'local', name: 'userData', item: 'userId' });

// 设置存储项
StorageUtil.set({ type: 'local', name: 'userData', value: { userId: 123, name: 'John Doe' } });

// 链式操作
StorageUtil.chain({ type: 'local', name: 'userData' })
  .set('userId', 456)
  .set('name', 'Jane Doe')
  .remove('name')
  .clear(); // 清空存储项
----------------------------------------------------------------------