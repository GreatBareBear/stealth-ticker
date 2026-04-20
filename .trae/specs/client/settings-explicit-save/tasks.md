# Tasks
- [x] Task 1: 实现 IPC 窗口通信以支持重新挂载与关闭 (`client/src/main/index.ts`)
  - [x] SubTask 1.1: 增加 `close-settings-window` 事件监听以隐藏设置窗口。
  - [x] SubTask 1.2: 在 `settingsWindow` 的 `ready-to-show` 和 `show` 中发送 `settings-shown`，在 `close` 拦截中发送 `settings-closed`。
- [x] Task 2: 在 `Settings.tsx` 中实现 Store 拦截代理和底部操作栏
  - [x] SubTask 2.1: 拦截 `window.api.store` 的 `get`, `set`, `delete` 方法，指向内存草稿对象。
  - [x] SubTask 2.2: 在 `useEffect` 监听 `settings-shown` 和 `settings-closed`，清理内存草稿并强制子组件重渲染。
  - [x] SubTask 2.3: 在页面底部添加 `Space` 和 `Button`，并在 `handleConfirm` 将内存草稿 Flush 到真实 Store 后触发 IPC。
- [x] Task 3: 优化子组件并发写入逻辑 (`AdvancedTab.tsx`, `DisplayTab.tsx`)
  - [x] SubTask 3.1: 将旧的 `settingsRef` 并发合并逻辑去除，使用 `lastSavePromise` 链中实时 await `window.api.store.get('settings')`（从拦截层）进行深拷贝合并。
- [x] Task 4: 确保编译不报错 (`npm run typecheck:main` 和 `npm run typecheck:web`)。
- [x] Task 5: 彻底解决 React 白屏崩溃和循环依赖问题
  - [x] 弃用全局 StoreContext，改为使用属性传递 (Props Injection) 将 `proxyStore` 直接传递给各个子 Tab。
  - [x] 增强容错：为所有 store 访问添加安全的回退逻辑 `window?.api?.store || { get: ... }`，防止初始化时因对象不存在导致的空指针崩溃。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]