# Compact Alert Modal Layout Spec

## Why
目前预警设置弹窗（Modal）中的表单项（预警类型、触发条件、阈值、提醒文案、提醒方式）全部采用了 `layout="vertical"` 纵向排列，导致弹窗的高度过高，占据了较多的屏幕空间。为了提供更精致、紧凑的界面体验，可以通过调整表单布局，让整个弹窗变得更紧凑、更小巧。

## What Changes
- 修改 `client/src/renderer/src/components/settings/StocksTab.tsx` 中的预警设置 `<Modal>`：
  - 将预警类型、触发条件和阈值这三个关联度高的字段合并在一行显示（例如使用 Ant Design 的 `Space` 或 `Row/Col`，或者内联的 `Form.Item`）。
  - 减少各个 `Form.Item` 之间的间距（例如设置 `style={{ marginBottom: 8 }}`）。
  - 将弹窗整体宽度适度缩小（例如通过 `width={400}` 参数）。
  - 修改 `TextArea` 的默认高度（例如指定 `rows={2}` 或 `autoSize`）。

## Impact
- Affected code:
  - `client/src/renderer/src/components/settings/StocksTab.tsx`

## ADDED Requirements
无新增系统功能。

## MODIFIED Requirements
### Requirement: 预警设置弹窗 UI
The alert configuration modal SHALL have a compact layout, combining related fields (Type, Condition, Threshold) onto a single row and reducing overall vertical spacing and window width.

#### Scenario: Success case
- **WHEN** user clicks the alert icon
- **THEN** a compact modal appears with "Type", "Condition", and "Threshold" fields displayed inline horizontally.
- **AND** the vertical spacing between form items is reduced.
- **AND** the overall width of the modal is reduced compared to default.