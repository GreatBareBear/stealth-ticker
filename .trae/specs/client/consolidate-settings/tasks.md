# Tasks
- [x] Task 1: 将功能迁移至 `AdvancedTab.tsx`
  - [x] SubTask 1.1: 在 `AdvancedTab.tsx` 中引入 `Popconfirm`，并在组件中增加 `handleClearData` 函数（复制原 `OtherTab` 逻辑）。
  - [x] SubTask 1.2: 在 `AdvancedTab.tsx` 的 `Collapse` `items` 中新增一个 key 为 `privacy` 的面板，标题为“数据与隐私”。
  - [x] SubTask 1.3: 在这个新面板中添加表单项 `searchMode`（自动搜索模式）和包含 `handleClearData` 的“一键清理数据”按钮。
  - [x] SubTask 1.4: 确保 `initialValues` 和 `loadSettings` 支持读取 `searchMode`。
- [x] Task 2: 移除 `OtherTab.tsx`
  - [x] SubTask 2.1: 删除文件 `client/src/renderer/src/components/settings/OtherTab.tsx`。
- [x] Task 3: 清理 `Settings.tsx`
  - [x] SubTask 3.1: 移除 `Settings.tsx` 中引入的 `OtherTab`。
  - [x] SubTask 3.2: 移除 `items` 数组中的 `key: '7', label: '其它'`。
- [x] Task 4: 确保编译不报错 (`npm run typecheck:web`)。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1, Task 2, Task 3]