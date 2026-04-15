# Tasks

- [x] Task 1: 修复预警设置弹窗底部开关无法切换的问题
  - [x] SubTask 1.1: 在 `StocksTab.tsx` 的 `<Form>` 组件内部增加一个隐藏的 `<Form.Item name="enabled" hidden valuePropName="checked"><Switch /></Form.Item>` 以保证表单字段不被卸载。
  - [x] SubTask 1.2: 调整底部 `footer` 里的 `Switch`，将其 `checkedChildren` 修改为 "开启"，`unCheckedChildren` 修改为 "暂停"。
- [x] Task 2: 同步全局预警开关文案
  - [x] SubTask 2.1: 调整全局“全部预警” `Switch` 的 `checkedChildren` 为 "开启"，`unCheckedChildren` 为 "暂停"。

# Task Dependencies
无
