# Move Alert Enabled Toggle Spec

## Why
当前“预警设置”弹窗内的“启用预警”开关放在表单最上方，会占用表单区域的纵向空间。将其移动到弹窗底部操作区（与“清除预警”并列）可以让表单区域更聚焦于阈值、文案、提醒方式等配置项，同时减少视觉割裂，整体更紧凑。

## What Changes
- 调整 `client/src/renderer/src/components/settings/StocksTab.tsx` 的“预警设置”弹窗布局：
  - 将表单内的 `Form.Item name="enabled"` 移除。
  - 在 `Modal` 的 `footer` 中增加一个 `Switch`，与“清除预警”按钮并排显示，用于控制 `enabled` 状态。
  - `Switch` 的当前值与表单字段保持一致：打开弹窗时与当前配置同步；切换时更新表单字段（`form.setFieldValue('enabled', ...)`），保存时仍随表单一起持久化。

## Impact
- Affected code:
  - `client/src/renderer/src/components/settings/StocksTab.tsx`

## ADDED Requirements
无新增系统功能。

## MODIFIED Requirements
### Requirement: 预警设置弹窗布局紧凑化
The alert modal SHALL place the enable/disable toggle in the footer area next to the delete button to reduce form vertical space, while preserving the same behavior and persistence semantics.

#### Scenario: Success case
- **WHEN** user opens the alert modal
- **THEN** the enable toggle is displayed next to “清除预警” in the footer
- **AND** toggling it updates the saved `enabled` status correctly

