# Tasks

- [x] Task 1: 调整“关于”页面 React 组件布局
  - [x] SubTask 1.1: 在 `client/src/renderer/src/pages/About.tsx` 中，将底部包裹输入框和按钮的 `div` 从 `flex-row` 布局改为纵向布局（或将按钮移出原本的水平弹性容器）。
  - [x] SubTask 1.2: 让输入框所在的容器宽度最大化（占满可用宽度），按钮单独放置在新的一行并靠右对齐。
  - [x] SubTask 1.3: 移除中段版权信息区域的 `overflowY: 'auto'`，去除滚动条限制。

- [x] Task 2: 调整主进程窗口尺寸
  - [x] SubTask 2.1: 在 `client/src/main/index.ts` 的 `openAbout()` 方法中，将 `aboutWindow` 的 `height` 参数从 400 调整为 450，以提供足够的垂直空间。

# Task Dependencies
- [Task 1] 与 [Task 2] 相互独立，但需共同完成以达到最终视觉效果。