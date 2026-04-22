# Tasks
- [x] Task 1: 修复大小写匹配导致的 Loading 问题
  - [x] SubTask 1.1: 在 `src/main/alertService.ts` 的 `poll` 中，将请求 API 的 `symbols` 统一转换为小写。
  - [x] SubTask 1.2: 在 `alertService.ts` 的 `parseResponse` 中，为 `newData` 生成原始、全小写、全大写的键值映射。
  - [x] SubTask 1.3: 在 `alertService.ts` 的 `checkAlerts` 中，检查警报时增加 `toLowerCase()` 与 `toUpperCase()` 回退查找。
  - [x] SubTask 1.4: 在 `src/renderer/src/pages/Monitor.tsx` 中渲染股票行数据时，增加 `toLowerCase()` 与 `toUpperCase()` 回退查找。

- [x] Task 2: 移除默认股票填充逻辑，允许悬浮窗为空
  - [x] SubTask 2.1: 在 `src/main/index.ts` 中，移除 `existingStocks.length === 0` 的判断和向 `store` 写入 `DEFAULT_STOCKS` 的逻辑，只在 `!Array.isArray` 时初始化为 `[]`。
  - [x] SubTask 2.2: 在 `src/renderer/src/pages/Monitor.tsx` 中，删除 `DEFAULT_STOCKS` 常量，将 `currentStocks` 逻辑修改为只依赖 `storeStocks`，非数组时回退到 `[]`。

- [x] Task 3: 运行验证
  - [x] SubTask 3.1: 运行 `npm run typecheck:web` 和 `npm run typecheck:node`。

# Task Dependencies
- [Task 1] can run parallel with [Task 2]
- [Task 3] depends on [Task 1] and [Task 2]