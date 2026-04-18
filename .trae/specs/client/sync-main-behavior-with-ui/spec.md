# Sync Main Process Behavior with UI Settings Spec

## Why
在“高级设置”中，UI 提供了“总在最前”、“显示通知区图标”、“开启页面右键”、“幽灵模式”等开关。但目前在主进程（`main/index.ts`）中，只有“幽灵模式”被正确响应，其他诸如 `alwaysOnTop` 是硬编码为 `true` 的，托盘图标（Tray）也永远被创建且无法隐藏，页面右键菜单也没有受设置控制。这导致用户的设置项“形同虚设”，降低了应用行为的一致性和隐蔽性体验。

## What Changes
- 提取一个通用的 `applySettings(settings)` 方法，在应用启动和设置变更（`store:set('settings')`）时被调用。
- **总在最前 (alwaysOnTop)**：根据 `settings.alwaysOnTop !== false` 动态更新 `mainWindow.setAlwaysOnTop(...)`，并在窗口初始化时应用该设置。
- **幽灵模式 (ghostMode)**：根据 `settings.ghostMode !== false` 动态更新 `mainWindow.setSkipTaskbar(...)`，并在窗口初始化时应用。
- **显示通知区图标 (showTrayIcon)**：如果 `settings.showTrayIcon === false`，则销毁当前的 `tray` 实例；如果为 `true` 且当前没有 `tray`，则调用 `createTray()`。
- **开启页面右键 (enableContextMenu)**：在 `ipcMain.on('show-context-menu')` 中增加拦截，只有当 `settings.enableContextMenu !== false` 时才弹出原生右键菜单。

## Impact
- Affected specs: 窗口行为控制、托盘行为、上下文菜单。
- Affected code: `client/src/main/index.ts`

## MODIFIED Requirements
### Requirement: 响应用户行为设置
主进程必须严格遵守用户的各项设置开关：
- **WHEN** 用户关闭“总在最前”
- **THEN** 主窗口不再置顶。
- **WHEN** 用户关闭“显示通知区图标”
- **THEN** 托盘图标应立即消失，且下次启动不再显示。
- **WHEN** 用户关闭“开启页面右键”
- **THEN** 在主界面点击右键将不再弹出“锁定面板/设置/退出”等原生菜单。