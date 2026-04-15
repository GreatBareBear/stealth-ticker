# Fix Alert Toggle Switch Spec

## Why
在将“启用预警”开关移动到弹窗底部操作区后，开关点击无法切换状态。原因是在 Ant Design 的 `Form` 中，由于底部操作区（footer）位于 `Form` 组件外部，脱离了 `<Form.Item name="enabled">` 的数据绑定。使用 `form.setFieldValue('enabled', checked)` 更新一个没有对应 `Form.Item` 的字段时，`useWatch` 无法正常触发视图更新。
同时，用户询问了开关的文案定义。考虑到预警功能支持后续恢复，使用“开启/暂停”相比“启用/禁用”能更好地传达“临时停止，后续可恢复”的语义，体验更自然。

## What Changes
- 在 `StocksTab.tsx` 的 `<Form>` 内部补充一个隐藏的 `<Form.Item name="enabled" hidden valuePropName="checked"><Switch /></Form.Item>`，以确保表单状态能够正确跟踪和更新该字段。
- 将预警弹窗底部开关的文案从“启用/暂停”调整为“开启/暂停”。
- 将全局预警控制开关的文案也同步调整为“开启/暂停”以保持全局统一。

## Impact
- Affected specs: 预警弹窗界面、预警控制。
- Affected code: `client/src/renderer/src/components/settings/StocksTab.tsx`

## ADDED Requirements
无新功能，主要是修复现有功能和优化文案。

## MODIFIED Requirements
### Requirement: 预警开启/暂停控制
- **WHEN** 用户在预警设置弹窗底部点击开关时
- **THEN** 开关状态应立即切换，并同步更新表单的 `enabled` 字段。
- **WHEN** 查看开关的文字提示时
- **THEN** 应该显示为“开启”或“暂停”。

## REMOVED Requirements
无
