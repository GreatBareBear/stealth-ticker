# Tasks
- [ ] Task 1: 盘点现有设置项并建立映射表
  - [ ] SubTask 1.1: 列出当前 DisplayTab/AdvancedTab 中所有设置字段（key、类型、默认值、作用范围）。
  - [ ] SubTask 1.2: 将参考图元素映射到现有字段或新增字段（例如：灰度、右键开关、列自定义）。
- [ ] Task 2: 设计并落地统一的 Settings 结构组件（仅在采纳后实现）
  - [ ] SubTask 2.1: 定义 SettingsSection / SettingsRow 的布局规范（标题、行对齐、说明文本、间距）。
  - [ ] SubTask 2.2: 定义控件形态规范（Segmented、Chip 多选、Switch、Slider）的使用边界与样式 token。
- [ ] Task 3: 引入“自定义列”Chip 多选交互（仅在采纳后实现）
  - [ ] SubTask 3.1: 在数据看板/表格页面接入列选择配置，并持久化到 store。
  - [ ] SubTask 3.2: 增加“开启列数影响展示宽度”的提示文案与约束策略（如超过 N 项提示）。
- [ ] Task 4: 调整主题与隐蔽性控件的交互一致性（仅在采纳后实现）
  - [ ] SubTask 4.1: 将“字体大小”等少量选项改为 Segmented（或保持 Select，但统一视觉）。
  - [ ] SubTask 4.2: 为透明度/灰度等滑块增加解释文案，并明确作用范围（仅悬浮窗/全局）。
  - [ ] SubTask 4.3: 将右键菜单开关等二元选项统一为 Switch/Segmented。
- [ ] Task 5: 回归验证与可用性检查
  - [ ] SubTask 5.1: 验证所有设置读写与生效路径（store -> UI -> Monitor）无回归。
  - [ ] SubTask 5.2: 验证在“低透明度 + 灰度”极端组合下，信息仍可读且不刺眼。

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 2
- Task 5 depends on Task 3, Task 4

