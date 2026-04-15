# Tasks

- [x] Task 1: 定义免打扰配置与持久化
  - [x] SubTask 1.1: 约定并实现 store keys（示例）：
    - `alertsTempPausedUntil`（number，毫秒时间戳，0/undefined 表示未启用）
    - `alertsDndEnabled`（boolean）
    - `alertsDndStart`（string，HH:mm）
    - `alertsDndEnd`（string，HH:mm）
    - `alertsDndAllowedMethods`（string[]，可选：popup/sound/blink；为空表示全部静默）
  - [x] SubTask 1.2: 在 `StocksTab.tsx` 加载并展示当前免打扰状态（例如“进行中/未开启”）。

- [x] Task 2: 自选股票页顶部增加免打扰入口与弹窗
  - [x] SubTask 2.1: 在 `StocksTab.tsx` 顶部“全部预警”区域旁新增“免打扰”入口（按钮/文字按钮）。
  - [x] SubTask 2.2: 实现免打扰弹窗 UI：
    - 临时暂停：30/60/120 分钟按钮 + “立即恢复”
    - 时间段免打扰：启用开关 + 开始/结束时间输入（HH:mm）
    - 免打扰期间提醒方式：多选（托盘闪烁/提示音/弹窗）或“全部静默”
  - [x] SubTask 2.3: 保存配置写入 store，并在弹窗关闭后立即生效。

- [x] Task 3: 盯盘逻辑接入免打扰规则
  - [x] SubTask 3.1: 在 `Monitor.tsx` 中读取免打扰配置并判断当前是否处于免打扰状态（临时暂停 or 时间段命中）。
  - [x] SubTask 3.2: 在免打扰生效时，对被屏蔽的提醒方式不执行发送（不创建 Notification，不发送 trigger-alert IPC）。
  - [x] SubTask 3.3: 免打扰生效时仍更新触发状态（triggeredKeys、lastTriggeredAt 等）避免免打扰结束后瞬间补发/连发。

- [x] Task 4: 校验与验证
  - [x] SubTask 4.1: 运行 `npm -C client run typecheck:web`。

# Task Dependencies
- [Task 3] 依赖 [Task 1] 的配置定义与 key 约定。
