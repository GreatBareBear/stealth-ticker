# Enhance Boss Key Stealth Spec

## Why
目前的老板键（Boss Key）隐藏逻辑仅仅是调用了 `mainWindow.hide()`。在某些操作系统环境下，仅仅隐藏窗口可能仍会被任务切换器（Alt+Tab / Cmd+Tab）、截图工具或某些系统调度中心发现，这降低了应用在“老板键”触发时的隐蔽性，无法满足极限盯盘的需求。

## What Changes
- **强化隐藏策略**：当触发 Boss Key 执行“隐藏”操作时，除了调用 `mainWindow.hide()` 外，同时动态调用系统级 API 进一步抹除应用痕迹：
  - 调用 `mainWindow.setSkipTaskbar(true)` 确保窗口不在任务栏中出现（即使系统某些情况下记住了它的存在）。
  - （仅 macOS）调用 `app.dock.hide()` 以在 macOS 下彻底隐藏 Dock 栏图标。
- **恢复策略**：当再次触发 Boss Key 恢复显示时，还原之前的状态：
  - 调用 `mainWindow.show()`。
  - 根据用户的 `ghostMode` 设置，决定是否调用 `mainWindow.setSkipTaskbar(false)`。
  - （仅 macOS）如果用户的 `ghostMode`（在 macOS 下通常对应不在 dock 显示）没有开启，则调用 `app.dock.show()` 恢复 Dock 栏图标。

## Impact
- Affected specs: 老板键（Boss Key）功能。
- Affected code: `client/src/main/index.ts`

## MODIFIED Requirements
### Requirement: 深度隐藏 (Deep Stealth)
当用户通过 Boss Key 触发隐藏操作时，应用 SHALL 尽可能消除在操作系统中的可见痕迹：
- **WHEN** 用户按下 Boss Key 进行隐藏
- **THEN** 主窗口必须被隐藏。
- **AND** 窗口必须从任务栏中移除。
- **AND** 在 macOS 下，Dock 栏图标必须被隐藏。
- **WHEN** 用户再次按下 Boss Key 恢复显示
- **THEN** 必须根据当前的设置项（如幽灵模式）正确恢复任务栏和 Dock 栏的显示状态。