# Tasks

- [x] Task 1: 将“启用预警”开关移动到弹窗底部操作区
  - [x] SubTask 1.1: 修改 `client/src/renderer/src/components/settings/StocksTab.tsx`，移除表单区域的 `Form.Item name="enabled"`。
  - [x] SubTask 1.2: 在 `Modal` 的 `footer` 中，和“清除预警”并列增加 `Switch`，显示“启用/暂停”，其值来源于当前表单或当前股票预警配置。
  - [x] SubTask 1.3: 切换 `Switch` 时同步更新表单字段 `enabled`，并确保点击“保存”后持久化的 `alerts[symbol].enabled` 正确变化。

# Task Dependencies
无
