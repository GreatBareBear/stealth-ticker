# Tasks

- [x] Task 1: 移除老板键对设置界面的影响
  - [x] SubTask 1.1: 在 `client/src/main/index.ts` 中找到 `registerBossKey` 函数。
  - [x] SubTask 1.2: 找到 `if (settings.bossKeyAction === 'exit')` 后的 `else` 分支（即 `hide` 动作）。
  - [x] SubTask 1.3: 移除 `if (settingsWindow && settingsWindow.isVisible()) { settingsWindow.hide() }` 的判断及执行代码，仅保留对 `mainWindow` 的处理。

# Task Dependencies
- [Task 1] 无依赖。
