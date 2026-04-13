# Tasks

- [x] Task 1: 修改“关注的股票”为“自选股票”
  - [x] SubTask 1.1: 在 `client/src/renderer/src/pages/Settings.tsx` 中，找到 `items` 数组的 `key: '1'`。
  - [x] SubTask 1.2: 将 `label` 属性从 `'关注的股票'` 修改为 `'自选股票'`。

- [x] Task 2: 移除 `AdvancedTab` 中的重叠设置项
  - [x] SubTask 2.1: 打开 `client/src/renderer/src/components/settings/AdvancedTab.tsx`，找到 `initialValues` 和 `defaultSettings`，移除其中关于 `fontSize`, `lineHeight`, `backgroundColor`, `opacity`, `refreshInterval` 的键值。
  - [x] SubTask 2.2: 找到并删除 UI 中 `<Title level={5}>外观与显示</Title>` 及下方的所有 `Form.Item` (`fontSize`, `lineHeight`, `backgroundColor`, `opacity`)。
  - [x] SubTask 2.3: 删除 `行为与控制` 模块下的 `<Form.Item label="刷新间隔" name="refreshInterval">`。
  - [x] SubTask 2.4: 移除 `handleValuesChange` 函数中关于 `_changedValues.refreshInterval` 的相关警告和处理逻辑，因为该项已经被移除。

# Task Dependencies
- [Task 2] 可以与 [Task 1] 并行处理。
