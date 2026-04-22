# Tasks
- [x] Task 1: 修复后台网络请求与解码崩溃问题
  - [x] SubTask 1.1: 在 `alertService.ts` 中，对请求 URL 的股票代码进行 `encodeURIComponent` 和 `trim()` 处理。
  - [x] SubTask 1.2: 在 `response.on('end')` 中添加完整的 `try-catch-finally` 结构，并在 `catch` 中实现 `utf8` 降级，确保 `scheduleNextPoll()` 必定执行。
- [x] Task 2: 修复数据解析不匹配导致的映射丢失
  - [x] SubTask 2.1: 在 `parseResponse` 中，放宽正则表达式为末尾分号可选 `;?`，并将字段长度校验阈值降低为 `> 10`。
  - [x] SubTask 2.2: 从 `parts[2]` 提取纯数字代码，并同样生成大小写兼容的键值映射（解决无 `sh/sz` 前缀导致找不到数据的 Bug）。
- [x] Task 3: 修复前端取值匹配问题
  - [x] SubTask 3.1: 在 `Monitor.tsx` 和 `alertService.ts`（检查预警时）的 `stockData[stock.symbol]` 取值前，统一加上 `trim()`，消除多余空格的影响。
- [x] Task 4: 编译检查与验证
  - [x] SubTask 4.1: 运行 `npm run typecheck:web` 与 `npm run typecheck:node` 确保所有修复代码符合类型校验。

# Task Dependencies
- [Task 1] depends on nothing
- [Task 2] depends on nothing
- [Task 3] depends on nothing
- [Task 4] depends on [Task 1], [Task 2], [Task 3]