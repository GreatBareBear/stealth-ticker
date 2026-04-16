# Tasks
- [x] Task 1: 更新免打扰入口 UI (StocksTab.tsx): 移除“免打扰”文字按钮，将状态标签(Tag)改为可点击并添加状态图标。
  - [x] SubTask 1.1: 导入 `@ant-design/icons` 的相关图标 (如 `MinusCircleOutlined`, `ClockCircleOutlined`)。
  - [x] SubTask 1.2: 重构免打扰状态的生成逻辑（`dndStatusText`, `color`, `icon` 等属性），以符合新设计方案（例如：“免打扰: 剩余 30分钟”）。
  - [x] SubTask 1.3: 将原本 `Button` 上的 `onClick={() => setIsDndModalVisible(true)}` 迁移到 `Tag` 元素上，并设置其样式为可点击（`cursor: 'pointer'`）。
  - [x] SubTask 1.4: 确保编译不报错。

# Task Dependencies
无
