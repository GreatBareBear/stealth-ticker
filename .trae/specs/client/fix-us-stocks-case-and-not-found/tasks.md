# Tasks
- [x] Task 1: 修复后台请求参数中针对美股的格式化
  - [x] SubTask 1.1: 在 `alertService.ts` 的 `poll` 方法中，保留其他市场小写的逻辑，但当 `sym` 以 `us` 开头时，将后面的字母强制转换为大写（如 `usAAPL`）。
- [x] Task 2: 标识无数据的无效股票
  - [x] SubTask 2.1: 在 `alertService.ts` 解析结束后，检查本次请求的所有 `symbols`（包括原始小写形态）是否在 `newData` 中都有对应键值。如果没有，则添加一个特殊的错误标记对象：`{ symbol: s.symbol, error: 'Not Found' }`，这样渲染端才能知道这只股票已被请求过但无数据。
- [x] Task 3: 监控面板展示 "Not Found"
  - [x] SubTask 3.1: 在 `Monitor.tsx` 渲染逻辑中，如果 `data.error` 为真（或存在该属性），则显示 "Not Found"（或者红色的错误文本）而不是 "Loading..."。
- [x] Task 4: 编译检查与验证
  - [x] SubTask 4.1: 运行 `npm run typecheck:web` 与 `npm run typecheck:node` 确保代码无 TypeScript 报错。

# Task Dependencies
- [Task 1] depends on nothing
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 1], [Task 2], [Task 3]