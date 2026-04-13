# Tasks

- [x] Task 1: 调整透明度滑块范围为 0–100
  - [x] SubTask 1.1: 在 `client/src/renderer/src/components/settings/DisplayTab.tsx` 中，将 `Slider` 的 `min` 从 10 调整为 0。
  - [x] SubTask 1.2: 更新 `marks`，将 0 标记为“全透明”，100 标记为“不透明”。

- [x] Task 2: 联动验证悬浮窗透明度表现
  - [x] SubTask 2.1: 确认 `client/src/renderer/src/pages/Monitor.tsx` 的 `opacity` 计算逻辑对 0 与 100 都能正确生效。

# Task Dependencies
- [Task 2] 依赖于 [Task 1]。
