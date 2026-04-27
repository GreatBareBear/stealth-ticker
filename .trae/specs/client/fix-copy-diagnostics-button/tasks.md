# Tasks
- [x] Task 1: 修复复制按钮被容器拖拽事件拦截的问题
  - [x] SubTask 1.1: 在 `Monitor.tsx` 中的 `<button onClick={copyDiagnostics} ...>` 上添加 `onPointerDown={(e) => e.stopPropagation()}`。
- [x] Task 2: 验证
  - [x] SubTask 2.1: 运行 `npm run typecheck:web` 与 `npm run typecheck:node`。

# Task Dependencies
- [Task 1] depends on nothing
- [Task 2] depends on [Task 1]