# Tasks
- [ ] Task 1: 主进程补充并缓存轮询状态
  - [ ] SubTask 1.1: 在 `alertService.ts` 的 response 回调中记录 `statusCode` 与 `data.length`，并随 `stock-poll-status` 一并发送。
  - [ ] SubTask 1.2: 在主进程缓存 `lastPollStatus`，并新增 IPC handler（例如 `get-stock-poll-status`）供渲染层查询。
- [ ] Task 2: preload 暴露查询与订阅能力
  - [ ] SubTask 2.1: 在 `preload/index.ts` 暴露 `getStockPollStatus()`、`onStockPollStatus()`、`offStockPollStatus()`。
  - [ ] SubTask 2.2: 更新 `preload/index.d.ts` 与 `renderer/env.d.ts` 类型声明。
- [ ] Task 3: Monitor 页面增加状态条与看门狗
  - [ ] SubTask 3.1: 在 `Monitor.tsx` 增加 “Polling Status” 状态条（展示 phase/age/statusCode/bytes 等）。
  - [ ] SubTask 3.2: 增加 watchdog 定时器：超过阈值未收到事件则显示 “Polling not running / IPC disconnected”。
- [ ] Task 4: 增加“复制诊断信息”
  - [ ] SubTask 4.1: 在 `Monitor.tsx` 添加复制入口，拼接诊断文本并写入剪贴板。
- [ ] Task 5: 验证
  - [ ] SubTask 5.1: 运行 `npm run typecheck:web` 与 `npm run typecheck:node`。
  - [ ] SubTask 5.2: 手动验证：正常网络/断网/接口被拦截三种情况下，状态条与 watchdog 文案符合预期。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 1], [Task 2], [Task 3], [Task 4]

