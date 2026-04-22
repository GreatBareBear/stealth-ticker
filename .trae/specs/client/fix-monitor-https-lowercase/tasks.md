# Tasks
- [x] Task 1: 统一后台请求的股票代码为全小写，并升级回 HTTPS 协议
  - [x] SubTask 1.1: 在 `alertService.ts` 中，将 `symbols` 的格式化逻辑精简，对所有提取的股票代码使用 `.toLowerCase()`。
  - [x] SubTask 1.2: 将 `const url` 的协议前缀从 `http://` 更改为 `https://`。
- [x] Task 2: 修复前端搜索股票时保存的代码格式
  - [x] SubTask 2.1: 在 `StocksTab.tsx` 中，去除对 `exchange === 'us'` 的 `code.toUpperCase()` 转换，确保保存的 `symbol` 全是小写。
- [x] Task 3: 编译检查与验证
  - [x] SubTask 3.1: 运行 `npm run typecheck:web` 和 `npm run typecheck:node` 确保代码无 TypeScript 报错。

# Task Dependencies
- [Task 1] depends on nothing
- [Task 2] depends on nothing
- [Task 3] depends on [Task 1], [Task 2]