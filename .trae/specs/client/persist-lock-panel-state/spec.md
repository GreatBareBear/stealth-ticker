# Lock Panel Persistence and Temp Unlock Spec

## Why
目前“锁定面板”的状态仅在单次运行期间有效，重启后会重置为未锁定状态。另外，如果用户同时开启了“幽灵模式/锁定面板”并关闭了“系统托盘图标”，他们将无法点击窗口，也没有托盘菜单可以解锁，从而陷入“死锁”无法进入设置的窘境。需要持久化锁定状态，并提供一个防卡死的临时解锁手势。

## What Changes
- **持久化锁定状态**：将 `isPanelLocked` 状态存储到 `electron-store` 的 `panelLocked` 字段中，并在应用启动时读取。
- **IPC 白名单更新**：将 `panelLocked` 添加到 `ALLOWED_STORE_KEYS` 白名单中。
- **临时解锁手势 (Temp Unlock Gesture)**：
  - 在渲染进程主窗口（`Monitor.tsx`）监听全局的 `mousemove`、`mouseleave` 和 `keydown`/`keyup` 事件。
  - 当检测到鼠标在窗口上方且用户按住 `Alt` (Option) 键时，通过 IPC 通知主进程临时恢复鼠标交互响应。
  - 主进程接收到 `temp-unlock` 事件时，如果当前处于锁定状态，则动态调用 `mainWindow.setIgnoreMouseEvents(false)` 临时解锁；松开 `Alt` 或鼠标移出时恢复 `setIgnoreMouseEvents(true, { forward: true })`。

## Impact
- Affected specs: 窗口交互行为、面板锁定。
- Affected code: `client/src/main/index.ts`, `client/src/preload/index.ts`, `client/src/renderer/src/env.d.ts`, `client/src/renderer/src/pages/Monitor.tsx`

## ADDED Requirements
### Requirement: 锁定状态持久化
系统 SHALL 记住用户最后一次设定的面板锁定状态，并在下次启动时自动应用。

### Requirement: 临时解锁手势 (Anti-Brick)
系统 SHALL 提供按键手势临时穿透锁定状态：
- **WHEN** 窗口处于锁定状态（鼠标穿透）且鼠标悬停在窗口上方
- **AND** 用户按住 `Alt` 键
- **THEN** 窗口临时恢复鼠标交互响应（可点击右键菜单、拖拽等）
- **WHEN** 用户松开 `Alt` 键或鼠标离开窗口
- **THEN** 窗口立即恢复鼠标穿透的锁定状态
