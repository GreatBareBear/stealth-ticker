# Tasks

- [x] Task 1: 安装拖拽依赖
  - [x] SubTask 1.1: 在 `client` 目录下执行 `npm install @dnd-kit/core @dnd-kit/modifiers @dnd-kit/sortable @dnd-kit/utilities` 安装所需的拖拽库依赖。

- [x] Task 2: 改造 StocksTab 支持拖拽
  - [x] SubTask 2.1: 修改 `client/src/renderer/src/components/settings/StocksTab.tsx`，引入 `@dnd-kit/core`, `@dnd-kit/modifiers`, `@dnd-kit/sortable`, `@dnd-kit/utilities`。
  - [x] SubTask 2.2: 根据 Ant Design 文档提供的 DND 方案，创建一个可排序行组件 `Row` (`SortableContext` / `useSortable`)。
  - [x] SubTask 2.3: 在表格外层包装 `DndContext`，并将 `stocks` 数组包装进 `SortableContext` 中，使其可被排序。
  - [x] SubTask 2.4: 将表格中现有的 `<DragOutlined />` 设置为拖拽句柄（`setActivatorNodeRef` 和相应的 `listeners`）。
  - [x] SubTask 2.5: 实现 `onDragEnd` 事件，如果 `active.id !== over.id`，则计算新的股票顺序并调用已有的 `updateStocks` 函数持久化到存储中。

# Task Dependencies
- [Task 2] 依赖于 [Task 1] 安装好库之后才能修改代码。