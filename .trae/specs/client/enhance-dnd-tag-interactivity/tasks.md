# Tasks
- [x] Task 1: 增强免打扰状态胶囊的交互视觉 (StocksTab.tsx)
  - [x] SubTask 1.1: 导入 `SettingOutlined`, `RightOutlined`。
  - [x] SubTask 1.2: 在关闭状态下，将 `dndTagIcon` 修改为 `<SettingOutlined />`。
  - [x] SubTask 1.3: 使用 `<Tooltip title="点击设置免打扰">` 包裹原有的 `<Tag>` 元素。
  - [x] SubTask 1.4: 修改 `<Tag>` 的内容，在文本后方追加 `<RightOutlined style={{ fontSize: 10, marginLeft: 4, opacity: 0.6 }} />`。
- [x] Task 2: 确保编译不报错 (`npm run typecheck:web`)。

# Task Dependencies
- [Task 2] depends on [Task 1]
