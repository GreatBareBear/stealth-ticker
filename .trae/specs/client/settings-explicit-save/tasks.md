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

- [ ] Task 6: 修复“确定/取消不关闭窗口”的 IPC 调用链
  - [x] SubTask 6.1: 在 `client/src/preload/index.ts` 的 `api` 中新增 `closeSettingsWindow(): void`，内部 `ipcRenderer.send('close-settings-window')`
  - [x] SubTask 6.2: 在 `client/src/renderer/src/pages/Settings.tsx` 中改为调用 `window.api.closeSettingsWindow()`（并保留兼容性 fallback）
  - [x] SubTask 6.3: 若项目存在 `global.d.ts`/`env.d.ts` 等类型声明文件，为 `window.api.closeSettingsWindow` 增加 TS 类型定义
  - [ ] SubTask 6.4: 验证点击“确定/取消”后设置窗口会隐藏关闭（不销毁），再次打开状态符合 Spec（确定保存、取消丢弃）

- [x] Task 7: 加固“关闭/保存”体验与可观测性
  - [x] SubTask 7.1: 在 `Settings.tsx` 中为保存成功/失败提供用户可见反馈（message）
  - [x] SubTask 7.2: 为关闭行为增加多重兜底（`window.api.closeSettingsWindow` → `ipcRenderer.send` → `window.close()`）
  - [x] SubTask 7.3: 运行 `npm run typecheck:web` 与 `npm run typecheck:node` 均通过

- [x] Task 8: 支持浏览器/纯前端环境下的设置修改与持久化测试
  - [x] SubTask 8.1: 在 `Settings.tsx` 中，将 `window.api.store` 的回退层实现改为使用 `localStorage` 的虚拟 Store，并去除阻止保存的错误提示。
  - [x] SubTask 8.2: 在 `Monitor.tsx` 同样增加对 `localStorage` 的兜底，保证浏览器环境也能完整测试整个数据流的存储和读取。

- [x] Task 9: 修复无 ipcRenderer 环境下的伪保存问题
  - [x] SubTask 9.1: 在 `Settings.tsx` 中，如果 `ipcRenderer` 不可用（例如浏览器环境或 preload 加载异常），增加对 `document.visibilitychange` 的监听，在 `hidden` 时清理草稿，在 `visible` 时重建组件，避免修改的配置产生被“保存”的错觉。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
