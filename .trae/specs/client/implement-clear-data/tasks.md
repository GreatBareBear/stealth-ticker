# Tasks

- [x] Task 1: 在“其它”页增加一键清理数据入口
  - [x] SubTask 1.1: 修改 `client/src/renderer/src/components/settings/OtherTab.tsx`，增加“数据与隐私”区域与“一键清理数据”按钮（带二次确认）。
  - [x] SubTask 1.2: 点击确认后依次调用 `window.api.store.delete(key)` 删除 spec 中定义的 keys。
  - [x] SubTask 1.3: 清理完成后提示成功，并避免影响现有“搜索设置”功能。

- [x] Task 2: 校验与验证
  - [x] SubTask 2.1: 运行 `npm -C client run typecheck:web`。

# Task Dependencies
无
