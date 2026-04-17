# Tasks
- [x] Task 1: 重构“预设模板”为 Segmented 模式选择器 (DisplayTab.tsx)
  - [x] SubTask 1.1: 定义预设枚举与配置表（推荐/隐蔽/清晰），统一由单一函数应用预设。
  - [x] SubTask 1.2: 将现有三个按钮替换为 `Segmented`，并加入 `自定义` 状态用于展示当前非预设配置。
  - [x] SubTask 1.3: 选择预设时写入 `settings.displayPreset` 并应用对应字段值。
- [x] Task 2: 实现“手动微调 -> 自定义”自动切换 (DisplayTab.tsx)
  - [x] SubTask 2.1: 在 `onValuesChange` 中识别与预设相关的字段变更。
  - [x] SubTask 2.2: 当检测到用户修改（非程序批量应用预设）时，将 `settings.displayPreset` 设为 `custom` 并同步到表单。
- [x] Task 3: 增加预设差异说明文本 (DisplayTab.tsx)
  - [x] SubTask 3.1: 根据当前选中预设渲染一行简短说明（例如：透明度/字号/刷新/高低价）。
- [x] Task 4: 验证与勾选
  - [x] SubTask 4.1: 运行 `npm run typecheck:web` 通过。
  - [x] SubTask 4.2: 更新本 spec 的 `tasks.md` 和 `checklist.md` 勾选状态。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2]
- [Task 4] depends on [Task 3]
