# Tasks
- [x] Task 1: 移除主进程 IPC 和调试状态
  - [x] SubTask 1.1: 在 `alertService.ts` 移除 `lastPollStatus` 缓存和 IPC 发送（`emitPollStatus`），删除相关类型。
  - [x] SubTask 1.2: 在 `main/index.ts` 中移除 `get-stock-poll-status` 和 `copy-to-clipboard` 监听器。
- [x] Task 2: 移除 Preload 与类型声明
  - [x] SubTask 2.1: 在 `preload/index.ts` 移除 `getStockPollStatus`、`onStockPollStatus`、`offStockPollStatus`、`copyToClipboard`。
  - [x] SubTask 2.2: 在 `preload/index.d.ts` 和 `renderer/env.d.ts` 移除类型定义。
- [x] Task 3: 清理 Monitor.tsx 页面
  - [x] SubTask 3.1: 删除顶部状态栏 DOM（含“复制诊断”按钮和相关样式）。
  - [x] SubTask 3.2: 删除所有 watchdog 变量、`copyDiagnostics` 方法以及相关的 `useEffect` 订阅。
  - [x] SubTask 3.3: 恢复默认的 `Loading...` 提示（不保留 IPC disconnected 等状态显示）。
- [x] Task 4: 编译检查
  - [x] SubTask 4.1: 运行 `npm run typecheck:web` 与 `npm run typecheck:node`。

# Task Dependencies
- [Task 1] depends on nothing
- [Task 2] depends on nothing
- [Task 3] depends on nothing
- [Task 4] depends on [Task 1], [Task 2], [Task 3]