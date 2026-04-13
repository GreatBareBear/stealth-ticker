# Fix Settings Tabs Margin Spec

## Why
用户反馈在上一轮的 UI 优化中，设置界面“标题”和“Tabs 标签栏”之间的空白间距并没有明显缩小。
这主要是因为 Ant Design 的 `Tabs` 组件除了 `horizontalMargin` 配置外，在其内部包裹元素 `.ant-tabs-nav` 上可能还带有不可覆盖的默认 `margin` 或 `padding`，导致通过 `ConfigProvider` 和内联 `margin: 0` 的修改仍未彻底生效。为确保留白被压缩至期望的极简状态，我们需要采用更直接的方法。

## What Changes
- 在 `client/src/renderer/src/pages/Settings.tsx` 中，对包裹 `<Tabs>` 的容器使用负外边距（negative margin），强制将 Tabs 区域整体上移。
- 为标题所在的 `div` 设定一个确切的底部内边距 `paddingBottom: '8px'` 或完全保持 `0`。
- 添加行内或全局的 `style` 直接作用于 `<Tabs>` 组件。

## Impact
- Affected code:
  - `client/src/renderer/src/pages/Settings.tsx`

## ADDED Requirements
无新增系统功能，仅做针对性的布局样式修复。

## MODIFIED Requirements
### Requirement: 强制消除 Tabs 的顶层留白
The system MUST forcefully reduce the vertical gap between the settings title ("设置") and the top navigation tabs by overriding or bypassing Ant Design's native tab wrapper margins.