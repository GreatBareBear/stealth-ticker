# Tasks

- [x] Task 1: 扩展预警配置模型与默认值
  - [x] SubTask 1.1: 扩展 `AlertConfig` 增加 `cooldownSeconds` 与 `hysteresis` 字段（兼容旧数据）。
  - [x] SubTask 1.2: 新建预警时填充默认值（例如 cooldownSeconds=60, hysteresis=0）。

- [x] Task 2: 预警设置弹窗增加表单项
  - [x] SubTask 2.1: 在 `StocksTab.tsx` 的预警弹窗中增加“冷却时间(秒)”与“回撤阈值”字段。
  - [x] SubTask 2.2: 回撤阈值在价格/涨跌幅两种类型下均可配置（数值输入）。

- [x] Task 3: 盯盘逻辑应用冷却与回撤
  - [x] SubTask 3.1: 在 `Monitor.tsx` 中实现按 key 记录上次触发时间并应用冷却时间。
  - [x] SubTask 3.2: 实现回撤阈值的解除触发判定，避免阈值附近抖动重复提醒。
  - [x] SubTask 3.3: 全局暂停/单股启用状态切换时清理相关触发状态，避免残留。

- [x] Task 4: 校验与验证
  - [x] SubTask 4.1: 运行 `npm -C client run typecheck:web`。

# Task Dependencies
- [Task 3] 依赖 [Task 1] 的字段定义。
