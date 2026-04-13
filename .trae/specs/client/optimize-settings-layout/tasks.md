# Tasks

- [x] Task 1: 缩小顶部标题栏的内边距和边框
  - [x] SubTask 1.1: 在 `client/src/renderer/src/pages/Settings.tsx` 中，找到包含 `<h2>设置</h2>` 的外层 `div`。
  - [x] SubTask 1.2: 修改其 `padding` 从 `16px 24px` 调整为 `12px 24px 4px 24px`，以大幅缩小标题下方的留白。
  - [x] SubTask 1.3: 移除该外层 `div` 上的 `borderBottom: '1px solid #e8e8e8'`，以消除和标签栏之间的割裂感，让整体更为连贯。

- [x] Task 2: 调整 Tabs 的默认边距
  - [x] SubTask 2.1: 在同一文件中，找到 `Tabs` 标签的 `tabBarStyle` 属性。
  - [x] SubTask 2.2: 添加 `margin: 0`（原先为 `marginBottom: 0`）以重置所有默认的外部边距，使标签栏进一步向上靠拢。

- [x] Task 3: 优化 Tabs 内容区密度与间距
  - [x] SubTask 3.1: 在 `client/src/renderer/src/pages/Settings.tsx` 的设置页根容器增加 `className`，用于限定样式作用范围。
  - [x] SubTask 3.2: 在 `client/src/renderer/src/assets/main.css` 增加仅对设置页生效的样式覆盖，将 `.ant-form-item` 的 `margin-bottom` 从默认值压缩到约 12px。
  - [x] SubTask 3.3: 在同一处样式覆盖中，为 Tabs 内容区增加稳定的顶部 `padding`（建议 12px），让页签栏与首个设置项之间有合理间距。

# Task Dependencies
- [Task 1] 和 [Task 2] 为界面微调，可同时进行。
- [Task 3] 与前两项独立，可在任意时机实施。
