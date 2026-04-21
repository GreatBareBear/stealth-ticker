# Tasks
- [x] Task 1: 初始化 electron-store 中 `stocks` 的默认列表
  - [x] SubTask 1.1: 在 `src/main/index.ts` 增加判断 `store.has('stocks')`，若不存在则初始化
- [x] Task 2: 同步 `Monitor.tsx` 的默认自选股数据
  - [x] SubTask 2.1: 为 `Monitor.tsx` 中的 `DEFAULT_STOCKS` 增加与设置中相同的四个默认自选股（上证指数、深证成指、平安银行、贵州茅台）
- [x] Task 3: 确保编译不报错 (`npx tsc --noEmit -p tsconfig.web.json`)