# System Optimizations Spec

## Why
当前 stealth-ticker 项目已具备完整的核心能力（透明无边框悬浮窗、实时行情、老板键、托盘与关于等），完成度较高。但在深度“摸鱼”场景的隐蔽性体验、UI 细节以及后台性能上仍有优化迭代空间。为了提供更极致的使用体验，本规范综合评估了现有功能并提出了一轮综合优化迭代。

## What Changes
- **功能设计：鼠标穿透与锁定面板**：在托盘菜单增加“锁定面板”选项，开启后悬浮窗将忽略鼠标事件（鼠标穿透），完全不妨碍用户操作下方的其他软件，防止日常办公时误触拖动，实现极致隐蔽。
- **功能设计：后台性能优化**：当悬浮窗被“老板键”隐藏时，停止或大幅降低后台轮询请求行情的频率，重新显示时恢复，从而降低 CPU 与网络消耗。
- **UI 设计：设置页操作逻辑优化**：当前设置项是实时保存生效的，但底部仍有“取消/确定”按钮容易引起误解。需要移除底部的无效按钮区域，让交互逻辑更自洽。
- **UI 设计：关于页面联系方式优化**：将 `About.tsx` 中的 Home、E-mail 等只读 `Input` 框替换为 Ant Design 的 `Typography.Text` 配合 `copyable`（一键复制）或 `<a>` 链接，提升视觉精致度和易用性。

## Impact
- Affected code:
  - `client/src/main/index.ts`
  - `client/src/renderer/src/pages/Monitor.tsx`
  - `client/src/renderer/src/pages/Settings.tsx`
  - `client/src/renderer/src/pages/About.tsx`

## ADDED Requirements
### Requirement: 锁定面板与鼠标穿透
The system SHALL allow users to lock the monitor window, making it ignore all mouse events and pass them through to underlying applications.

#### Scenario: Success case
- **WHEN** user selects "锁定面板" from the tray menu
- **THEN** the monitor window becomes un-draggable and clicks pass through it.
- **WHEN** user unchecks "锁定面板"
- **THEN** the monitor window restores normal drag and click behavior.

### Requirement: 后台轮询降频
The system SHALL reduce or pause API polling when the monitor window is hidden by the boss key.

## MODIFIED Requirements
### Requirement: 设置页与关于页交互优化
The Settings window SHALL NOT display misleading "Cancel/OK" buttons if settings are auto-saved. The About window SHALL use copyable text or links for contact info instead of readonly inputs.