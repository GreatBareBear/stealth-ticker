# 修复设置窗口 Alt 菜单与免打扰状态样式 Spec

## Why
1) Windows 下设置窗口按下 Alt 键会触发默认菜单栏（File/Edit/View 等）显示，破坏极简、纯净的产品体验。  
2) 自选股票页底部“免打扰”状态当前以普通灰字展示，信息层级与视觉一致性较弱，影响可读性。

## What Changes
- **设置窗口菜单栏**：在创建设置窗口后，强制隐藏/移除菜单栏，使 Alt 键不再弹出默认菜单项。
- **免打扰状态展示**：将自选股票页底部控制区的“免打扰”状态改为更清晰的状态胶囊/标签（Tag），并保持可点击打开免打扰弹窗。

## Impact
- Affected specs: 设置窗口 UI、免打扰入口 UI
- Affected code:
  - `client/src/main/index.ts`（`openSettings()`）
  - `client/src/renderer/src/components/settings/StocksTab.tsx`

## ADDED Requirements
无

## MODIFIED Requirements
### Requirement: 设置窗口不出现默认菜单栏
- **WHEN** 用户打开设置窗口并按下 Alt 键
- **THEN** 标题栏不应出现 “File / Edit / View ...” 等默认菜单项。

### Requirement: 免打扰状态清晰可读
- **WHEN** 用户查看自选股票页底部控制区
- **THEN** “免打扰”状态应以明显的状态标签展示：
  - 免打扰进行中：突出显示（例如警示色），并显示剩余时间（若为临时暂停）。
  - 时间段免打扰已开启但当前未命中：中性提示（例如蓝色/默认色）显示“已开启”。
  - 未开启：弱提示显示“未开启”。
- **AND** 点击“免打扰”入口仍可打开免打扰设置弹窗。

## REMOVED Requirements
无

