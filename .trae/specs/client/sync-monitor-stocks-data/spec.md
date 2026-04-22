# Sync Monitor Stocks Data Spec

## Why
当用户在设置界面中修改自选股票或相关设置时，主进程的 `store` 和 `AlertService` 已更新并拉取新的行情数据，但悬浮行情窗口（Monitor.tsx）并未监听到配置变更事件。这导致 Monitor.tsx 内存中仍保留旧的股票列表，由于这些被剔除或未拉取的股票不再收到主进程推送的行情数据，因此在 UI 上会一直卡在 "Loading..." 状态。

## What Changes
- 主进程 `ipcMain.handle('store:set')` 和 `ipcMain.handle('store:delete')` 在数据落盘后，通过 `mainWindow.webContents.send('config-updated', key)` 向渲染进程推送变更事件。
- Preload 层暴露 `window.api.onConfigUpdated` 和 `window.api.offConfigUpdated` 以接收主进程的配置变更通知。
- 在 `Monitor.tsx` 中增加对 `config-updated` 的监听，当 `settings` 或 `stocks` 变化时主动重新加载本地配置（`loadConfigAndData`）。
- 增加了针对浏览器兜底环境（无 Electron IPC 时）的 `window.addEventListener('storage')` 跨 Tab 变更监听，实现浏览器级别的自选股同步。

## Impact
- Affected code: `src/main/index.ts`, `src/preload/index.ts`, `src/renderer/src/pages/Monitor.tsx`, `src/preload/index.d.ts`, `src/renderer/src/env.d.ts`.

## ADDED Requirements
### Requirement: Reactive Monitor Configuration
The system SHALL dynamically update the floating monitor window whenever user settings or selected stocks change in the settings window, without requiring a manual restart or window toggle.

#### Scenario: Settings Update Success
- **WHEN** the user changes the selected stocks and clicks "Confirm"
- **THEN** the monitor window immediately reloads its internal state, removing obsolete stocks, and successfully displays the latest stock data without getting stuck on "Loading...".