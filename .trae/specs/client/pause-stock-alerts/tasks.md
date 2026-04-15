# Tasks

- [ ] Task 1: 扩展预警数据模型与兼容旧数据
  - [ ] SubTask 1.1: 扩展 `AlertConfig` 增加 `enabled: boolean`（默认 `true`），并确保旧数据（缺少该字段）加载时自动补齐为启用状态。
  - [ ] SubTask 1.2: 新增全局暂停存储键 `alertsGlobalPaused: boolean`（默认 `false`）。

- [ ] Task 2: 设置界面增加“全部暂停/恢复”与单股快速暂停
  - [ ] SubTask 2.1: 在 `StocksTab.tsx` 顶部添加一个 `Switch`，用于切换 `alertsGlobalPaused` 的值并持久化保存。
  - [ ] SubTask 2.2: 在自选股票列表“操作”列，增加一个与铃铛/删除并列的快速开关（Switch 或图标按钮），用于切换该股票预警的 `enabled` 状态并持久化。
  - [ ] SubTask 2.3: 在预警设置弹窗中增加“启用预警/暂停预警”开关，与当前表单一起保存。

- [ ] Task 3: 监控触发逻辑支持暂停语义
  - [ ] SubTask 3.1: 在 `Monitor.tsx` 中读取 `alertsGlobalPaused`；为 true 时直接跳过预警触发逻辑。
  - [ ] SubTask 3.2: 对单股预警读取 `enabled`；为 false 时跳过该股票预警。
  - [ ] SubTask 3.3: 当从暂停恢复（全局或单股）时，确保不会被 `triggeredKeys` 永久抑制：对恢复的规则清理对应 key，允许下一次轮询正常触发一次。

# Task Dependencies
- [Task 3] 依赖 [Task 1] 的数据模型变更与 [Task 2] 的存储键落地。

