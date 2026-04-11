# Settings and Opacity Refinement Spec

## Why
1. 当前行情界面悬浮窗的“透明度”设置仅仅应用于背景色，使得文字信息始终是 100% 不透明的。用户希望透明度能对整个窗口（文字和背景）同等生效。
2. 设置界面的弹窗目前支持最小化、最大化，并且可以通过边缘调整大小。这导致内部 Tab 页的内容布局容易出现滚动条或留白。为了提升用户体验，需要将设置窗口固定大小并移除不必要的最大化/最小化按钮。
3. 高级 Tab 页缺乏控制行情页面“右键菜单”显示与否的开关，需要补充。
4. 各个 Tab 页的页面布局需要优化，以防止固定窗口尺寸后出现多余的侧边滚动条。

## What Changes
- 修改 `client/src/renderer/src/pages/Monitor.tsx` 中的 `getBackgroundColor` 方法，取消将其直接转为带有 alpha 通道的 `rgba`，改为返回纯色 HEX，并将整体透明度直接设置在最外层 `div` 的 CSS `opacity` 属性上。
- 在 `client/src/main/index.ts` 的 `openSettings` 函数中，增加 `resizable: false, maximizable: false, minimizable: false` 以固定设置窗口。同时适当调整 `width` 和 `height` 以适配所有 Tab 的内容。
- 在 `client/src/renderer/src/components/settings/AdvancedTab.tsx` 的“行为与控制”模块下，新增“开启页面右键”的 `Segmented` 设置项（选项为“开启”/“关闭”），默认值为开启（`true`）。
- 在 `client/src/renderer/src/pages/Monitor.tsx` 中，根据 `settings.enableContextMenu` 控制是否允许右键弹出菜单。
- 优化 `client/src/renderer/src/pages/Settings.tsx` 及各个子 Tab 的布局：调整 padding，使得整体不需要在 y 轴上出现滚动条（或仅在内容确实溢出时平滑滚动）。

## Impact
- Affected code:
  - `client/src/main/index.ts`
  - `client/src/renderer/src/pages/Monitor.tsx`
  - `client/src/renderer/src/pages/Settings.tsx`
  - `client/src/renderer/src/components/settings/AdvancedTab.tsx`

## ADDED Requirements
### Requirement: 控制页面右键菜单
The system SHALL provide a toggle in the Advanced settings to enable or disable the right-click context menu on the Monitor window.

#### Scenario: Success case
- **WHEN** user sets "开启页面右键" to "关闭"
- **THEN** right-clicking on the floating monitor window will do nothing.

## MODIFIED Requirements
### Requirement: 透明度统一生效
The opacity setting SHALL apply to the entire Monitor window element via CSS `opacity`, ensuring both text and background are equally transparent.

### Requirement: 设置窗口固定
The Settings window SHALL NOT be resizable, maximizable, or minimizable, and MUST retain a clean layout without vertical scrollbars unless strictly necessary.
