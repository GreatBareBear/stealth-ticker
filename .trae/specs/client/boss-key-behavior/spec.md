# Boss Key Behavior Spec

## Why
目前，用户在“高级”选项卡中设置的老板键（快捷键）被触发时，会同时隐藏/显示“设置窗口”和“行情悬浮窗”。这导致用户如果正在通过设置界面调整配置，一旦触发老板键，设置界面也会突然消失。为了确保“设置功能是为行情悬浮窗服务”的逻辑独立性，老板键应当仅作用于股票行情悬浮窗界面（`mainWindow`）。

## What Changes
- 在 `client/src/main/index.ts` 中的 `registerBossKey` 方法中，移除对 `settingsWindow` 的隐藏（`hide`）逻辑。
- 当老板键动作设为 `hide` 时，确保仅对 `mainWindow` 进行 `hide()` 或 `show()` 的切换。
- **注意**：如果老板键的动作被设置为 `exit`（退出程序），则保持原来的 `app.quit()`，因为退出动作意味着终止整个应用程序，理应关闭所有窗口。

## Impact
- Affected code:
  - `client/src/main/index.ts`

## ADDED Requirements
无新增系统功能。

## MODIFIED Requirements
### Requirement: 老板键隐藏范围
When the Boss Key action is configured to "hide", it SHALL ONLY toggle the visibility of the main stock monitor floating window. The settings window MUST NOT be hidden or affected by the Boss Key.

#### Scenario: Success case
- **WHEN** user presses the Boss Key while both the settings window and the floating monitor window are visible
- **THEN** the floating monitor window hides (or shows), but the settings window remains visible on the screen.
