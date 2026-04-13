# About Window Design Spec

## Why
目前主界面的托盘菜单和右键菜单中存在“关于”选项，但点击时只会在控制台输出日志，没有实际的交互反馈。我们需要根据提供的设计参考图实现一个精美的“关于”弹窗界面，以展示软件的版本、版权信息、官方网站以及联系方式。

## What Changes
- 在 `client/src/main/index.ts` 中实现 `openAbout()` 函数，用于创建和管理独立的“关于”窗口。
- 新增 `client/src/renderer/src/pages/About.tsx`，按照参考图实现布局。包含：
  - 顶部左侧应用图标（与标题同行的柔和设计）与右侧的应用名称 `stealth-ticker` 和版本号 `V1.0.0`。
  - 中间的版权声明区：包含 `Copyright [C]`、`Xue Maogang 2025-2026`、`All Rights Reserved`、`Non-commercial use ONLY`。
  - 底部的联系信息区（表单风格）：显示 Home (`www.ipv8.com`)、E-mail (`43757098@qq.com`)、用户群 (`43757098`)。
  - 右下角的“检查更新”按钮。
- 在 React Router（`client/src/renderer/src/App.tsx` 等）中配置 `#/about` 路由映射到该新页面。
- 将 `main/index.ts` 中所有“关于”菜单的 `click` 回调指向 `openAbout()`。

## Impact
- Affected code:
  - `client/src/main/index.ts`
  - `client/src/renderer/src/App.tsx`
  - `client/src/renderer/src/pages/About.tsx` (New file)

## ADDED Requirements
### Requirement: “关于”窗口与界面
The system SHALL display an "About" dialog when the user clicks the "关于" menu item. The dialog MUST match the specified reference layout, including copyright details, developer contact info, and an update check button.

#### Scenario: Success case
- **WHEN** user clicks "关于" in the system tray or context menu
- **THEN** a non-resizable window opens displaying the application's logo, version, copyright ("Xue Maogang 2025-2026"), and contact information fields.