# Drag and Drop Reorder Stocks Spec

## Why
目前在“自选股票”设置界面中，用户可以添加、删除和隐藏股票，而且表格里已经有了一个“拖拽”图标的占位符，但实际上不支持拖拽排序功能。用户希望能够自由调整已添加股票的显示顺序，以便监控面板按他们期望的顺序展示股票。

## What Changes
- 在客户端项目中安装拖拽库依赖：`@dnd-kit/core`, `@dnd-kit/modifiers`, `@dnd-kit/sortable`, `@dnd-kit/utilities`（Ant Design 官方推荐的 Table 拖拽方案）。
- 修改 `client/src/renderer/src/components/settings/StocksTab.tsx`，引入 `DndContext` 等组件来包裹 Ant Design 的 `Table` 组件。
- 自定义 `Table` 的 `components.body.row` 为一个可排序（Sortable）的 React 组件。
- 在 `onDragEnd` 事件中获取拖拽前后的索引，重新排列 `stocks` 数组，并调用 `updateStocks` 将新顺序持久化到本地 Store。

## Impact
- Affected code:
  - `client/package.json`
  - `client/src/renderer/src/components/settings/StocksTab.tsx`

## ADDED Requirements
### Requirement: 自选股票拖拽排序
The system SHALL allow users to reorder stocks in the settings tab using drag-and-drop. The new order MUST be persisted to the store and reflected in the monitor window.

#### Scenario: Success case
- **WHEN** user drags a stock row using the drag handle and drops it in a new position
- **THEN** the stocks list updates to reflect the new order.
- **AND** the new order is saved to the local store automatically.