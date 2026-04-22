# Tasks
- [x] Task 1: 修复后台请求参数的严格大小写格式化
  - [x] SubTask 1.1: 在 `alertService.ts` 的 `poll` 方法中，移除简单的 `.toLowerCase()` 处理。
  - [x] SubTask 1.2: 添加分市场大小写格式化逻辑（纯数字补齐 `sh/sz`，美股强制为 `us` + 大写，其他强制为全小写）。
- [x] Task 2: 修复前端搜索框保存的股票代码格式
  - [x] SubTask 2.1: 在 `StocksTab.tsx` 的 `handleSearch` 中，处理 SmartBox 搜索结果时，若 `exchange === 'us'`，将代码部分转为大写（如 `usAAPL`）。
- [x] Task 3: 编译检查与验证
  - [x] SubTask 3.1: 运行 `npm run typecheck:web` 与 `npm run typecheck:node` 确保所有修复代码符合类型校验。

# Task Dependencies
- [Task 1] depends on nothing
- [Task 2] depends on nothing
- [Task 3] depends on [Task 1], [Task 2]