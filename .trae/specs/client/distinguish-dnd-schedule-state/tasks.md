# Tasks
- [x] Task 1: 为“时间段已开启但未生效”提供独立的入口视觉 (StocksTab.tsx)
  - [x] SubTask 1.1: 在免打扰状态计算中增加 `isScheduleEnabledButInactive` 状态（`alertsDndEnabled && !isDndActive`）。
  - [x] SubTask 1.2: 为该状态设计并实现极简视觉提示（推荐：按钮内的蓝色小圆点指示或更轻量的文案差异），确保与“关闭”一眼可区分且不显冗余。
  - [x] SubTask 1.3: 保持按钮可点击打开免打扰设置弹窗，且不影响“生效中/临时暂停”的高亮态。
- [x] Task 2: 同步优化免打扰弹窗的“当前状态”文案 (StocksTab.tsx)
  - [x] SubTask 2.1: 在 `alertsDndEnabled && !isDndActive` 时显示“已开启时间段（未生效）”或等效的简洁表达（可附带时间段）。
  - [x] SubTask 2.2: 在完全关闭时显示“未开启”。
- [x] Task 3: 验证与检查
  - [x] SubTask 3.1: 运行 `npm run typecheck:web` 通过。

# Task Dependencies
- [Task 3] depends on [Task 1]
- [Task 3] depends on [Task 2]
