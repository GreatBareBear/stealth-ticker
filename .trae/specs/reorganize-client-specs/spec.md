# Reorganize Client Specs Spec

## Why
目前由于客户端项目已被重命名为 `client`，而很多针对客户端进行修复和功能优化的 Spec 文档（如动态调整悬浮窗尺寸、修复显示问题等）散落放置在了 `.trae/specs/` 根目录下。为了保持项目结构的清晰度和代码对应关系的明确性，应当将所有属于客户端项目的 Spec 文档统一归拢至 `.trae/specs/client/` 路径下。同时，当前 `.trae/specs/client/` 下的初始项目 Spec 需要移动到子目录（如 `init`）中以避免与新目录混淆。

## What Changes
- 将原本位于 `.trae/specs/client/` 根目录下的基础文件（`spec.md`、`tasks.md`、`checklist.md`）移动至 `.trae/specs/client/init/` 目录。
- 将散落在 `.trae/specs/` 根目录下、且属于客户端修改的所有变更目录移动到 `.trae/specs/client/` 中：
  - `dynamic-window-resize` -> `.trae/specs/client/dynamic-window-resize`
  - `fix-monitor-display-issues` -> `.trae/specs/client/fix-monitor-display-issues`
  - `refine-advanced-settings-and-opacity` -> `.trae/specs/client/refine-advanced-settings-and-opacity`
  - `refine-settings-tabs` -> `.trae/specs/client/refine-settings-tabs`
  - `refine-ui-from-reference` -> `.trae/specs/client/refine-ui-from-reference`

## Impact
- Affected specs: 涉及重构和移动 `.trae/specs/` 下所有的文档目录结构。
- Affected code: 无直接代码改动，仅整理设计规范文档结构。

## ADDED Requirements
无新增系统功能。

## MODIFIED Requirements
### Requirement: 规范文档的目录结构
The system SHALL ensure that all specification documents related to the `client` project are neatly organized under `.trae/specs/client/<feature-name>/`.
