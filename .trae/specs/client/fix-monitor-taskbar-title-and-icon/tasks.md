# Tasks

- [x] Task 1: 修复主窗口的标题和图标配置
  - [x] SubTask 1.1: 在 `client/src/main/index.ts` 的 `createWindow()` 函数中找到 `mainWindow` 的初始化配置对象。
  - [x] SubTask 1.2: 增加 `title: 'stealth-ticker'`。
  - [x] SubTask 1.3: 将原先限制为 Linux 下才生效的图标传递 `...(process.platform === 'linux' ? { icon } : {})` 替换为无条件传递 `icon`。

# Task Dependencies
- [Task 1] 无前置依赖。
