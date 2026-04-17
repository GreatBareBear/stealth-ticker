# Tasks
- [x] Task 1: 调整免打扰入口的视觉策略（轻量状态提示）(StocksTab.tsx)
  - [x] SubTask 1.1: 引入 `Badge`（或等效实现）作为“已配置但未生效”的蓝色状态点，仅在该状态显示。
  - [x] SubTask 1.2: 将“时间段生效中”入口从 `primary` 填充改为橙色文字强调（保持 `type="text"`），文案为“免打扰中”。
  - [x] SubTask 1.3: 保持“关闭/临时暂停”入口文案与强调方式符合 Spec。
- [x] Task 2: 同步优化免打扰弹窗“当前状态”文案 (StocksTab.tsx)
  - [x] SubTask 2.1: 区分未开启 / 已开启未生效 / 时间段生效中 / 临时暂停。
  - [x] SubTask 2.2: 在时间段相关状态下附带时间段文本。
- [x] Task 3: 验证与检查
  - [x] SubTask 3.1: 运行 `npm run typecheck:web` 通过。

# Task Dependencies
- [Task 3] depends on [Task 1]
- [Task 3] depends on [Task 2]
