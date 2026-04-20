# Fix Settings Save-on-Close Spec

## Why
当前设置页的各项开关/输入通常通过 `Form.onValuesChange` 异步写入 `electron-store`。当用户修改后立刻关闭设置窗口时，窗口的 renderer 可能被销毁，导致尚未完成的 IPC 写入丢失；同时，多次快速修改会产生并发写入，存在乱序覆盖风险，从而表现为“重新打开设置界面后内容未保存”。

## What Changes
- **设置窗口关闭策略（主进程）**：拦截设置窗口的 `close` 事件，默认改为 `hide()` 而非销毁 renderer，避免关闭瞬间丢失未完成的写入。
- **设置写入串行化（渲染进程）**：将 `onValuesChange` 的写入改为“串行队列”或“防抖合并”方式，保证高频变更不会发生乱序覆盖，确保最终落盘的是最后一次修改值。
- **减少竞态读取**：在设置 Tab 内避免每次变更都 `store.get('settings')` 再 merge；改为加载时读一次缓存为 `settingsRef`，后续以表单全量值为准更新并写入。

## Impact
- Affected specs: 设置保存可靠性、设置窗口生命周期。
- Affected code:
  - `client/src/main/index.ts`
  - `client/src/renderer/src/components/settings/AdvancedTab.tsx`
  - `client/src/renderer/src/components/settings/DisplayTab.tsx`
  - （如存在其它通过 `onValuesChange` 写入 settings 的组件，也需要一并迁移）

## ADDED Requirements
### Requirement: 关闭即保存
系统 SHALL 在用户关闭设置窗口后，仍能保证用户最后一次修改被持久化。

#### Scenario: 快速关闭
- **WHEN** 用户修改任意设置项后立即关闭设置窗口
- **THEN** 再次打开设置窗口时必须展示刚才修改后的值

### Requirement: 写入顺序一致性
系统 SHALL 保证在短时间内连续修改多个设置时，最终存储结果与用户最后一次修改一致（无乱序覆盖）。

#### Scenario: 高频修改
- **WHEN** 用户连续快速修改多个设置项（例如拖动滑条/连续切换开关）
- **THEN** 最终持久化结果必须与最后一次 UI 状态一致

## MODIFIED Requirements
### Requirement: 设置窗口关闭行为
设置窗口的“关闭”行为 SHALL 以隐藏窗口为默认行为，而非销毁窗口；除非应用退出或显式销毁设置窗口。
