# Tasks
- [x] Task 1: 增加主进程轮询状态上报（IPC）
  - [x] SubTask 1.1: 在 `alertService.ts` 中定义并发送 `stock-poll-status` 事件（成功/失败/时间戳/错误信息/轮询间隔/请求 URL）。
  - [x] SubTask 1.2: 在 `preload/index.ts` 暴露 `onStockPollStatus` / `offStockPollStatus` 给渲染层。
- [x] Task 2: 监控面板展示可诊断状态
  - [x] SubTask 2.1: 在 `Monitor.tsx` 订阅 `stock-poll-status`，维护 `pollStatus` 状态。
  - [x] SubTask 2.2: 当某只股票无数据时，用 `pollStatus` 替换单一 “Loading...” 文案，展示“正在请求/最近失败原因/最近成功时间”等最小必要信息。
- [x] Task 3: 统一外部接口 HTTP → HTTPS
  - [x] SubTask 3.1: 扫描代码库中所有 `http://` 外部域名引用并替换为 `https://`（保留 localhost/127.0.0.1）。
  - [x] SubTask 3.2: 若存在 allowlist/CSP/CORS 规则，确保对应域名的 HTTPS 形式被允许。
- [x] Task 4: 验证
  - [x] SubTask 4.1: 运行 `npm run typecheck:web` 与 `npm run typecheck:node`。
  - [x] SubTask 4.2: 手动验证：断网/超时/正常网络三种情况下，Monitor 能显示可诊断状态而非永久 Loading。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 4] depends on [Task 1], [Task 2], [Task 3]
