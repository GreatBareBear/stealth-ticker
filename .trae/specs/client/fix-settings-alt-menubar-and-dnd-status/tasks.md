# Tasks

- [x] Task 1: 修复设置窗口 Alt 菜单栏
  - [x] SubTask 1.1: 在 `client/src/main/index.ts` 的 `openSettings()` 创建 `settingsWindow` 后移除菜单栏（例如调用 `settingsWindow.setMenu(null)` / `settingsWindow.setMenuBarVisibility(false)`）。
  - [x] SubTask 1.2: 验证按 Alt 键不再出现默认菜单项。

- [x] Task 2: 优化自选股票页免打扰状态展示
  - [x] SubTask 2.1: 在 `StocksTab.tsx` 底部控制区使用 `Tag`（或等效状态组件）替换当前纯文本状态展示。
  - [x] SubTask 2.2: 保持“免打扰”可点击打开弹窗；状态文案按“进行中/已开启/未开启”区分，并在临时暂停时显示剩余时间。

- [x] Task 3: 校验与验证
  - [x] SubTask 3.1: 运行 `npm -C client run typecheck:web`。

# Task Dependencies
无
