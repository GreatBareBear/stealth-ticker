# Stealth Mode and Tray Tooltip Spec

## Why
1. 当前系统托盘图标鼠标悬停时显示的提示文本为默认的英文 "Stealth Stock Monitor"（或 "stealth-stock-monitor"），为了保持项目名称的一致性和本地化，需要将其修改为 `stealth-ticker`。
2. 为进一步提升盯盘工具的隐蔽性，股票行情界面需要支持“幽灵模式”。当该模式开启时，悬浮窗不应该出现在操作系统的任务栏/状态栏中，从而避免被轻易发现。

## What Changes
- 修改 `client/src/main/index.ts` 中的 `createTray` 函数，将 `tray.setToolTip` 的内容更改为 `'stealth-ticker'`。
- 在 `client/src/renderer/src/components/settings/AdvancedTab.tsx` 中的“行为与控制”模块下，新增“幽灵模式”开关（`Segmented`），默认值为 `true`（开启）。
- 在 `client/src/main/index.ts` 中，读取 `settings.ghostMode`：
  - 在 `createWindow()` 创建 `mainWindow` 时，传入 `skipTaskbar: settings.ghostMode !== false` 属性。
  - 在 `ipcMain.handle('store:set')` 监听设置变更时，动态调用 `mainWindow.setSkipTaskbar(value.ghostMode !== false)`，使用户修改能立即生效。

## Impact
- Affected code:
  - `client/src/main/index.ts`
  - `client/src/renderer/src/components/settings/AdvancedTab.tsx`

## ADDED Requirements
### Requirement: 幽灵模式（不在任务栏显示）
The system SHALL provide a "Ghost Mode" toggle in the advanced settings. When enabled, the main stock monitor floating window MUST NOT appear in the operating system's taskbar.

#### Scenario: Success case
- **WHEN** user toggles "幽灵模式" to "开启"
- **THEN** the stock monitor window immediately disappears from the taskbar while remaining visible on the desktop.

## MODIFIED Requirements
### Requirement: 托盘提示名称
The system tray tooltip SHALL display "stealth-ticker" on hover.
