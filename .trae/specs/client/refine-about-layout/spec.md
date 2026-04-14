# Refine About Layout Spec

## Why
在当前的“关于”页面布局中，下方的“检查更新”按钮未能完整显示，超出了页面边界。为了保证所有信息完整呈现，需要将页面上半部分（版本和介绍信息）的位置上提，并使布局更加紧凑，从而为底部的按钮留出足够的显示空间。同时，文案“QQ群”需要调整为“QQ 群”（中英文之间加空格）以提升排版规范。

## What Changes
- 修改 `client/src/renderer/src/pages/About.tsx` 的布局参数：
  - 减小外层容器的 `padding`（如由 `24px` 改为 `16px 24px`）。
  - 减小顶部 Logo 与中间内容区的 `marginBottom`（如由 `24px` 改为 `16px`）。
  - 减小中间分隔线的 `margin`，使上半部分和中间的文字排版更紧凑。
  - 将 `QQ群` 文本修改为 `QQ 群`。
- 修改 `client/src/main/index.ts` 中的 `aboutWindow`：
  - 可选地将窗口高度略微增加（如从 460 增加到 480），以进一步确保容错空间，保证按钮完全不被遮挡。

## Impact
- Affected code:
  - `client/src/renderer/src/pages/About.tsx`
  - `client/src/main/index.ts`

## ADDED Requirements
无新增系统功能。

## MODIFIED Requirements
### Requirement: “关于”页面视觉与排版优化
The About window MUST completely display the bottom "Check Update" button without it being clipped by the window boundary. The layout of the top section MUST be compacted, and text MUST follow spacing conventions (e.g., "QQ 群").

#### Scenario: Success case
- **WHEN** user opens the About window
- **THEN** the application icon, version, copyright info, and contact forms are displayed compactly.
- **AND** the "Check Update" button at the bottom is fully visible.
- **AND** the text displays as "QQ 群" with a space.