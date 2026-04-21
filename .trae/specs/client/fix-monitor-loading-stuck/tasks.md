# Tasks
- [x] Task 1: 初始化 electron-store 中 `stocks` 的默认列表
  - [x] SubTask 1.1: 在 `src/main/index.ts` 增加判断 `store.has('stocks')`，若不存在则初始化
- [x] Task 2: 同步 `Monitor.tsx` 的默认自选股数据
  - [x] SubTask 2.1: 为 `Monitor.tsx` 中的 `DEFAULT_STOCKS` 增加与设置中相同的四个默认自选股（上证指数、深证成指、平安银行、贵州茅台）
- [x] Task 3: 确保编译不报错 (`npx tsc --noEmit -p tsconfig.web.json`)

- [x] Task 4: 当 `stocks` 存在但为空数组/非法数据时也能自动恢复默认值
  - [x] SubTask 4.1: 在 `src/main/index.ts` 中将条件从 “has key” 扩展为 “缺失/非数组/空数组”
  - [x] SubTask 4.2: 确保该初始化发生在 `AlertService.start()` 之前

- [ ] Task 5: 验证（手动与静态检查）
  - [ ] SubTask 5.1: 将 `stocks` 置为空数组后重启应用，确认行情界面不再卡在 Loading...
  - [x] SubTask 5.2: 运行 `npm run typecheck:node` 与 `npm run typecheck:web` 均通过
