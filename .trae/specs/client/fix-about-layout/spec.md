# Fix About Window Layout Spec

## Why
目前“关于”页面的布局不够合理：
1. 页面内容在当前尺寸下会出现不必要的滚动条。
2. 下方联系信息（Home、E-mail、QQ群等）的输入框宽度不够，导致重要信息无法完整显示。
3. 右侧的“检查更新”按钮占用了输入框的空间，导致横向拥挤。

## What Changes
- 修改 `client/src/renderer/src/pages/About.tsx` 中的布局：
  - 将底部“检查更新”按钮单独下移一行，放在右下角，以便让上方的输入框占满剩余的水平宽度，保证信息显示完整。
  - 移除中段内容区域（版权声明区）的强制滚动条样式（`overflowY: 'auto'`），让内容自然撑开。
- 修改 `client/src/main/index.ts` 中关于窗口（`aboutWindow`）的尺寸配置：
  - 将窗口高度从 400 适当调高至 450（或更大），以容纳换行后的按钮和内容，彻底消除滚动条。

## Impact
- Affected code:
  - `client/src/renderer/src/pages/About.tsx`
  - `client/src/main/index.ts`

## ADDED Requirements
无新增系统功能。

## MODIFIED Requirements
### Requirement: “关于”页面布局优化
The About window layout MUST display all text and input fields completely without requiring horizontal or vertical scrolling.

#### Scenario: Success case
- **WHEN** user opens the About window
- **THEN** the Home, E-mail, and QQ group input fields stretch to display their full content.
- **AND** the "Check Update" button is located on a separate line below the inputs.
- **AND** there is no scrollbar visible in the window.