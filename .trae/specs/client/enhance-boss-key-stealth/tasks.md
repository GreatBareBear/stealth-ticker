# Tasks
- [x] Task 1: 修改 `registerBossKey` 中的隐藏逻辑 (`index.ts`)
  - [x] SubTask 1.1: 当执行隐藏（`mainWindow.hide()`）时，额外调用 `mainWindow.setSkipTaskbar(true)`。
  - [x] SubTask 1.2: 当执行隐藏时，如果是 macOS（`process.platform === 'darwin'`），额外调用 `app.dock?.hide()` 隐藏 Dock。
- [x] Task 2: 修改 `registerBossKey` 中的恢复逻辑 (`index.ts`)
  - [x] SubTask 2.1: 当执行恢复（`mainWindow.show()`）时，根据 `settings.ghostMode` 恢复 `mainWindow.setSkipTaskbar(settings.ghostMode !== false)`。
  - [x] SubTask 2.2: 当执行恢复时，如果是 macOS（`process.platform === 'darwin'`），如果 `settings.ghostMode !== false`（非幽灵模式），额外调用 `app.dock?.show()` 恢复 Dock 显示。
- [x] Task 3: 确保编译不报错 (`npm run typecheck:main`)。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]