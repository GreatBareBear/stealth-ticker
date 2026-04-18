# UX Simplification: Consolidate Settings Spec

## Why
目前应用的设置面板中存在功能重叠或分类不清的问题：
1. **“高级”与“其它”重叠**：“其它”面板（`OtherTab.tsx`）里只有“一键清理数据”和“搜索设置”，这两项其实完全可以归类到“高级”面板（`AdvancedTab.tsx`）中作为独立的分组，减少用户的点击层级。
2. **避免重复组件**：将 `OtherTab` 的逻辑并入 `AdvancedTab` 后，可以删除多余的 `OtherTab.tsx` 文件以及 `Settings.tsx` 中的相关路由，使代码和 UI 都更简洁。

## What Changes
- **合并配置项**：将原本存在于 `otherSettings` store key 中的字段（如 `searchMode`）读取和保存逻辑整合进 `AdvancedTab.tsx` 的表单中（可以直接保存在 `settings` key 下，或者依然分别存）。为了简化，我们统一存入 `settings`。
- **UI 迁移**：将 `OtherTab.tsx` 中的“一键清理数据”按钮和“自动搜索模式”选项，以新的 `<Collapse.Panel>` 项（例如“数据与隐私”）形式，添加到 `AdvancedTab.tsx` 的 `items` 列表中。
- **清理冗余文件**：在 `client/src/renderer/src/components/settings/` 目录下删除 `OtherTab.tsx`，并在 `client/src/renderer/src/pages/Settings.tsx` 中移除对 `OtherTab` 的引入和相关 Tab 页面。

## Impact
- Affected specs: 设置面板结构。
- Affected code: 
  - `client/src/renderer/src/components/settings/AdvancedTab.tsx`
  - `client/src/renderer/src/pages/Settings.tsx`
  - Removed: `client/src/renderer/src/components/settings/OtherTab.tsx`

## REMOVED Requirements
### Requirement: 独立的“其它”设置页
**Reason**: 功能过于稀少，导致 Tab 栏拥挤，分类不明确。
**Migration**: 其内部功能转移至“高级”页签。