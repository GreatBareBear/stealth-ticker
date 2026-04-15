# Tasks

- [x] Task 1: 恢复设置界面为 7 个一级 Tab
  - [x] SubTask 1.1: 修改 `client/src/renderer/src/pages/Settings.tsx` 的 imports，恢复引用 `AdvancedTab / ChartTab / DashboardTab / MembershipTab / OtherTab`。
  - [x] SubTask 1.2: 修改 `items` 数组，恢复为 7 个 Tab：自选股票、显示、高级、股价图、数据看板、会员、其它（并保持现有“其它”命名）。
  - [x] SubTask 1.3: 移除对 `AlertsTab / PrivacyTab / DataTab` 的引用（不删除文件，仅不使用）。

- [x] Task 2: 恢复自选股票页的全局预警开关与视觉状态
  - [x] SubTask 2.1: 在 `client/src/renderer/src/components/settings/StocksTab.tsx` 中恢复 `alertsGlobalPaused` 的读取/保存逻辑（store key: `alertsGlobalPaused`）。
  - [x] SubTask 2.2: 在自选股票页顶部恢复“全部预警”的开关入口（开启/暂停），切换后写入 `alertsGlobalPaused`。
  - [x] SubTask 2.3: 恢复列表中铃铛图标在全局暂停时的灰色状态。

- [x] Task 3: 校验与验证
  - [x] SubTask 3.1: 运行 `npm -C client run typecheck:web` 确保无 TypeScript 错误。

# Task Dependencies
- [Task 2] 依赖于 [Task 1] 可并行执行（互不修改同一文件时可并行）。
