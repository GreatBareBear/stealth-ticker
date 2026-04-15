# 悬浮窗右键菜单补齐“锁定面板” Spec

## Why
当前托盘图标右键菜单包含“锁定面板”，但在股票悬浮窗口（监控面板）内右击弹出的菜单中缺少该项，导致两处菜单项不一致，用户无法在面板内直接完成“锁定/解锁”操作，影响易用性与心智一致性。

## What Changes
- 在主进程 `client/src/main/index.ts` 的悬浮窗右键菜单（`ipcMain.on('show-context-menu')`）中新增“锁定面板”checkbox 菜单项。
- “锁定面板”菜单项行为与托盘菜单保持一致：
  - 勾选：对悬浮窗调用 `setIgnoreMouseEvents(true, { forward: true })`，并向渲染进程发送 `window-locked` 状态。
  - 取消勾选：恢复鼠标响应并发送 `window-locked` 状态。
- 右键菜单中的勾选状态与托盘菜单保持一致（共享同一锁定状态源），避免出现两处显示不一致。

## Impact
- Affected specs: 右键菜单、锁定面板
- Affected code:
  - `client/src/main/index.ts`

## ADDED Requirements
无

## MODIFIED Requirements
### Requirement: 右键菜单项一致性
系统 SHALL 在悬浮窗右键菜单中提供与托盘菜单一致的“锁定面板”选项，并与托盘菜单的锁定状态保持同步。

#### Scenario: 悬浮窗右键锁定
- **WHEN** 用户在悬浮窗内右键打开菜单并勾选“锁定面板”
- **THEN** 悬浮窗应进入鼠标穿透/不可拖拽状态（与托盘菜单一致）
- **AND** 再次右键打开菜单时，“锁定面板”应显示为勾选状态

#### Scenario: 悬浮窗右键解锁
- **WHEN** 用户在悬浮窗内右键打开菜单并取消勾选“锁定面板”
- **THEN** 悬浮窗应恢复鼠标响应与可拖拽

## REMOVED Requirements
无

