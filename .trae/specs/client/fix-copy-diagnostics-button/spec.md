# Fix Copy Diagnostics Button Spec

## Why
用户反馈点击“复制诊断”按钮没有响应。经过排查发现，`Monitor.tsx` 的外层容器绑定了 `onPointerDown` 事件以支持窗口拖拽。当用户点击复制按钮时，事件冒泡到外层容器触发了 `setPointerCapture`，导致按钮的 `onClick` 事件无法正常触发。

## What Changes
- **Monitor.tsx**:
  - 在“复制诊断”按钮上添加 `onPointerDown={(e) => e.stopPropagation()}`，阻止事件冒泡到外层容器。这样点击按钮时就不会触发拖拽逻辑，`onClick` 事件便能正常执行。

## Impact
- Affected specs: 复制诊断信息。
- Affected code:
  - `src/renderer/src/pages/Monitor.tsx`

## ADDED Requirements
### Requirement: Copy Button Interactivity
The copy diagnostics button SHALL intercept pointer events so that it remains clickable despite the draggable window container.

#### Scenario: Click copy button
- **WHEN** user clicks the "复制诊断" button
- **THEN** the diagnostics text is copied to the clipboard and the button shows "已复制" without triggering window drag.