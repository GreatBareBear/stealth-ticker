# Tasks

- [x] Task 1: 使用内联样式强制调整 Tabs 的外层边距
  - [x] SubTask 1.1: 在 `client/src/renderer/src/pages/Settings.tsx` 中，定位到包含 `<h2>设置</h2>` 的外层 `div`，修改 `padding` 为 `12px 24px 8px 24px`，稍微留出标题自己的底部呼吸空间。
  - [x] SubTask 1.2: 找到包裹 `<Tabs>` 的 `div`（`<div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>`）。
  - [x] SubTask 1.3: 为该 `div` 或者内部直接对 `<Tabs>` 组件增加一个负向外边距 `marginTop: '-16px'`（根据截图情况微调，一般 12~16px 即可抵消 Ant Design 的原生边距），强行让整个 Tabs 容器上移。
  - [x] SubTask 1.4: 调整 `tabBarStyle={{ padding: '0 24px', margin: 0 }}`，保持不变。

# Task Dependencies
- [Task 1] 无前置依赖。