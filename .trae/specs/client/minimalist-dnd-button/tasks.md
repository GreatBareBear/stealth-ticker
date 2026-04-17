# Tasks
- [x] Task 1: 废弃状态胶囊，重构为极简按钮 (StocksTab.tsx)
  - [x] SubTask 1.1: 移除 `Tag`, `Tooltip`, `RightOutlined`, `SettingOutlined` 相关的 JSX 渲染，替换为标准的 `<Button>`。
  - [x] SubTask 1.2: 定义按钮的动态 `type` 属性（关闭时 `text`，开启时 `primary`）和动态 `danger` 属性（临时暂停时为 `true`）。
  - [x] SubTask 1.3: 精简状态文案，关闭时仅显示“免打扰”，时间段生效时显示“免打扰生效中”，临时暂停时显示“剩余 X分钟”。
  - [x] SubTask 1.4: 统一使用 `<ClockCircleOutlined />` 作为按钮图标。
- [x] Task 2: 确保编译不报错 (`npm run typecheck:web`)。

# Task Dependencies
- [Task 2] depends on [Task 1]
