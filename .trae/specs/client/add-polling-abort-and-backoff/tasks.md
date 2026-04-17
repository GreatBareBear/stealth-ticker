# Tasks
- [x] Task 1: 替换 `setInterval` 为动态定时器 (`alertService.ts`)
  - [x] SubTask 1.1: 移除 `start()` 中的 `setInterval` 逻辑。
  - [x] SubTask 1.2: 添加 `consecutiveFailures` 状态变量用于记录连续失败次数。
  - [x] SubTask 1.3: 增加一个私有的异步函数 `scheduleNextPoll()`，用于在 `poll()` 结束后动态设置 `this.pollTimeout = setTimeout(...)`。
- [x] Task 2: 实现行情请求的超时和错误控制 (`alertService.ts`)
  - [x] SubTask 2.1: 在 `poll()` 方法内，创建 `net.request` 时增加 `setTimeout(request.abort, timeoutMs)` 逻辑（或者使用类似机制中止请求）。
  - [x] SubTask 2.2: 在 `response.on('end')` 处理完成并解析成功后，重置 `consecutiveFailures = 0`，并调用 `scheduleNextPoll()`。
  - [x] SubTask 2.3: 在 `request.on('error')` 发生时或超时发生时，增加 `consecutiveFailures`，并调用 `scheduleNextPoll()`。
- [x] Task 3: 确保编译不报错 (`npm run typecheck:main`)。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]