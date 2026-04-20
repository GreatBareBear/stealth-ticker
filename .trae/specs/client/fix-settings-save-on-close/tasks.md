# Tasks
- [x] Task 1: 调整设置窗口关闭策略（主进程）
  - [x] SubTask 1.1: 在创建设置窗口处监听 `close` 事件并 `preventDefault()`，改为 `settingsWindow.hide()`。
  - [x] SubTask 1.2: 确保再次打开设置窗口时复用已存在的窗口实例（`show()` + `focus()`），避免重复创建与状态漂移。
  - [x] SubTask 1.3: 保留“真正销毁”的路径（例如应用退出或显式重置窗口），避免内存泄漏。
- [x] Task 2: 在渲染进程实现 settings 写入串行化
  - [x] SubTask 2.1: 在设置相关组件内实现一个可复用的“写入队列”（Promise chain）或防抖写入器，保证写入顺序与最终一致性。
  - [x] SubTask 2.2: 加载 settings 时读一次并写入 `settingsRef`（或 state），后续写入基于 `allValues` merge（不再每次 `store.get('settings')`）。
  - [x] SubTask 2.3: 将 `AdvancedTab.tsx` 的 `onValuesChange` 写入逻辑迁移到新的写入器。
  - [x] SubTask 2.4: 将 `DisplayTab.tsx` 的 `onValuesChange` 写入逻辑迁移到新的写入器。
- [ ] Task 3: 验证
  - [ ] SubTask 3.1: 复现并验证“修改后立即关闭设置窗口”仍可保存。
  - [ ] SubTask 3.2: 运行 `npm run typecheck:main` 与 `npm run typecheck:web` 均通过。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]
