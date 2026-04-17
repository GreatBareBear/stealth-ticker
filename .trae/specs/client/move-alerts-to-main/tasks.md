# Tasks
- [x] Task 1: 抽取并实现主进程 `AlertService` (`src/main/alertService.ts`)
  - [x] SubTask 1.1: 创建一个新的 `alertService.ts`，导出 `startAlertService(store, mainWindow, tray)`。
  - [x] SubTask 1.2: 在服务中维护内部状态（缓存的配置 `stocks`, `alerts`, `settings` 等），在启动时读取 `store.get()`。
  - [x] SubTask 1.3: 实现核心轮询循环：使用 `node-fetch` (或 `https.get`) 每隔 `settings.refreshRate` 秒获取腾讯行情。
  - [x] SubTask 1.4: 将原本位于 `Monitor.tsx` 中的“价格/涨跌幅告警判定、`cooldown` 与 `hysteresis`、DND/临时暂停判定”完整移植到该服务中。
  - [x] SubTask 1.5: 将触发的 `Notification` 改用 Electron 原生的 `Notification` 类，声音依然用 `shell.beep()`，闪烁逻辑用原本的 `tray` 逻辑。
- [x] Task 2: 建立主进程到渲染进程的实时数据流 (`alertService.ts`, `index.ts`, `preload/index.ts`, `env.d.ts`)
  - [x] SubTask 2.1: 每次轮询解析完行情数据后，通过 `mainWindow.webContents.send('stock-data-updated', newData)` 向渲染进程推送实时数据。
  - [x] SubTask 2.2: 提供 IPC 以便在设置变更时主进程能及时刷新其缓存配置：例如，在 `index.ts` 中的 `store:set` 触发时调用 `alertService.reloadConfig()`。
  - [x] SubTask 2.3: 在 `preload/index.ts` 导出 `onStockDataUpdated(callback)`。
  - [x] SubTask 2.4: 在 `env.d.ts` 补充该方法的类型。
- [x] Task 3: 重构渲染进程 (`Monitor.tsx`)
  - [x] SubTask 3.1: 移除原有的 `setInterval` 和 `fetch` 行情的逻辑。
  - [x] SubTask 3.2: 移除所有复杂的 `store.get('alerts')`、时间段判断、触发 `new Notification()` 和向主进程发送 `trigger-alert` 的逻辑。
  - [x] SubTask 3.3: 仅使用 `window.api.onStockDataUpdated` 接收推送的数据并更新 React State。
- [x] Task 4: 确保编译不报错 (`npm run typecheck:main` 和 `npm run typecheck:web`)。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 1, Task 2, Task 3]