# Tasks
- [x] Task 1: 主进程增加配置变更通知
  - [x] SubTask 1.1: 在 `index.ts` 中的 `ipcMain.handle('store:set')` 触发 `mainWindow.webContents.send('config-updated', key)`
  - [x] SubTask 1.2: 在 `ipcMain.handle('store:delete')` 触发 `mainWindow.webContents.send('config-updated', key)`
- [x] Task 2: Preload 暴露配置变更事件
  - [x] SubTask 2.1: 在 `preload/index.ts` 增加 `onConfigUpdated` 与 `offConfigUpdated`
  - [x] SubTask 2.2: 在 `env.d.ts` 和 `preload/index.d.ts` 中补齐相应的 TypeScript 类型声明
- [x] Task 3: Monitor.tsx 响应式刷新配置
  - [x] SubTask 3.1: 在 `Monitor.tsx` 增加对 `onConfigUpdated` 的监听，当 key 为 `settings` 或 `stocks` 时执行 `loadConfigAndData()`
  - [x] SubTask 3.2: 补充纯前端兜底：监听 `window.addEventListener('storage')`，以便在浏览器环境下也能跨 Tab 同步更新
- [x] Task 4: 编译检查与验证
  - [x] SubTask 4.1: 运行 `npm run typecheck:web` 与 `npm run typecheck:node` 确保 TS 检查通过

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]