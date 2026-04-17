# Tasks
- [x] Task 1: 提取 `applySettings` 函数 (`index.ts`)
  - [x] SubTask 1.1: 声明一个名为 `applySettings(settings: any)` 的方法，该方法负责处理主窗口和托盘的动态更新。
  - [x] SubTask 1.2: 在 `applySettings` 中，根据 `settings.alwaysOnTop !== false` 调用 `mainWindow?.setAlwaysOnTop(...)`。
  - [x] SubTask 1.3: 根据 `settings.ghostMode !== false` 调用 `mainWindow?.setSkipTaskbar(...)`。
  - [x] SubTask 1.4: 根据 `settings.showTrayIcon !== false` 控制托盘行为（`false` 时如果存在 `tray` 则 `tray.destroy(); tray = null`；为 `true` 时如果不存在则 `createTray()`）。
- [x] Task 2: 在启动和变更时调用 `applySettings` (`index.ts`)
  - [x] SubTask 2.1: 在 `store:set` 中针对 `settings` key 更新时，调用 `applySettings(value)`。
  - [x] SubTask 2.2: 移除 `store:set` 原本零散处理 `registerBossKey` 和 `setSkipTaskbar` 的旧代码，将其移入 `applySettings` 或紧随其后调用。
  - [x] SubTask 2.3: 在启动时的 `app.whenReady().then(...)` 逻辑中获取 `settings` 并初始化 `createTray()` (按需) 和 `createWindow()`。
  - [x] SubTask 2.4: 更新 `createWindow()` 的配置项 `alwaysOnTop: settings.alwaysOnTop !== false` 和 `skipTaskbar: settings.ghostMode !== false`。
- [x] Task 3: 处理右键菜单的权限 (`index.ts`)
  - [x] SubTask 3.1: 在 `ipcMain.on('show-context-menu')` 中获取当前的 `settings`。
  - [x] SubTask 3.2: 如果 `settings.enableContextMenu === false`，则提前 `return`，不执行后续构建菜单和弹出的操作。
- [x] Task 4: 确保编译不报错 (`npm run typecheck:node`)。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 1, Task 2, Task 3]