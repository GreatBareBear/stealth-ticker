# Tasks
- [x] Task 1: Monitor 明确区分 IPC 可用性并修正 watchdog 文案
  - [x] SubTask 1.1: 在 `Monitor.tsx` 计算 `ipcAvailable`/`storeAvailable`，当不可用时状态条显示 “IPC unavailable (web mode)”。
  - [x] SubTask 1.2: watchdog 判定仅在 `ipcAvailable` 且存在可见 stocks 时生效，避免纯 web mode 误判为 “IPC disconnected”。
- [x] Task 2: 复制按钮永久可见
  - [x] SubTask 2.1: 调整状态条布局，将“复制诊断”按钮锚定在右侧（absolute/fixed），并为状态文本预留 padding，避免被挤出/裁剪。
  - [x] SubTask 2.2: 确保 watchdog/web mode 下按钮仍渲染且可点击。
- [x] Task 3: 诊断内容增强
  - [x] SubTask 3.1: 复制诊断文本增加 `ipcAvailable`、`storeAvailable`、`hasPollStatus`、`userAgent` 等字段。
- [x] Task 4: 验证
  - [x] SubTask 4.1: 运行 `npm run typecheck:web` 与 `npm run typecheck:node`。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1], [Task 2], [Task 3]
