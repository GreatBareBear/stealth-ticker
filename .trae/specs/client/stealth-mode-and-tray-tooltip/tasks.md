# Tasks

- [x] Task 1: 托盘图标名称修改
  - [x] SubTask 1.1: 在 `client/src/main/index.ts` 中的 `createTray` 函数里，将 `tray.setToolTip('Stealth Stock Monitor')` 替换为 `tray.setToolTip('stealth-ticker')`。

- [x] Task 2: 增加“幽灵模式”设置项
  - [x] SubTask 2.1: 在 `client/src/renderer/src/components/settings/AdvancedTab.tsx` 的 `initialValues` 和 `defaultSettings` 对象中，增加 `ghostMode: true`。
  - [x] SubTask 2.2: 在“行为与控制”模块下添加 `<Form.Item label="幽灵模式" name="ghostMode">`，使用包含 `开启` (true) 和 `关闭` (false) 的 `Segmented` 组件。

- [x] Task 3: 主进程控制任务栏显示状态
  - [x] SubTask 3.1: 在 `client/src/main/index.ts` 的 `createWindow()` 函数中，读取设置 `const settings: any = store.get('settings') || {}`，并在 `BrowserWindow` 的配置参数里增加 `skipTaskbar: settings.ghostMode !== false`。
  - [x] SubTask 3.2: 在 `ipcMain.handle('store:set', ...)` 的监听函数中，增加对 `settings` 变更的处理：如果 `key === 'settings'` 且 `mainWindow` 存在，调用 `mainWindow.setSkipTaskbar(value.ghostMode !== false)`。

# Task Dependencies
- [Task 3] 依赖于 [Task 2] 的状态传递，但可以与 [Task 1] 并行处理。
