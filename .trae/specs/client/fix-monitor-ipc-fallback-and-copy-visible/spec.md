# 修复 Monitor 的 IPC 缺失误判与复制按钮可见性 Spec

## Why
用户反馈两类问题：
1) `pollStatus=null` 且显示 “Polling not running / IPC disconnected”。当前 Monitor 存在 `fallbackStore(localStorage)` 兜底读取逻辑，当运行环境未注入 `window.api`（例如仅运行 Web 页面、或 preload/IPC 未加载）时，会导致 UI 仍能显示 stocks，但主进程轮询实际上不存在或不可达，从而出现“误以为已配置但一直无轮询状态”的困惑。
2) 当状态文案较长或窗口很窄时，“复制诊断”按钮会在视觉上消失（被布局挤出/裁剪），导致无法复制诊断信息。

## What Changes
- Monitor 明确区分“Electron IPC 可用”与“仅 Web/无 IPC”两种运行态
  - 当 `window.api` 或 `window.api.store` 不可用时，状态条明确展示 “IPC unavailable (web mode)”；watchdog 不再以“IPC disconnected”误导为主结论。
  - 诊断复制内容中增加 `ipcAvailable`、`storeAvailable`、`pollStatusAvailable` 等关键标记，便于一次性定位是否是启动方式/注入问题。
- 复制按钮永久可见
  - 调整状态条布局：将复制按钮使用固定定位/绝对定位锚定在右侧，给状态文本预留右侧 padding，避免在窄窗口与长文案时被挤出或裁剪。
  - 即使处于 watchdog 或 web mode，按钮仍可点击并复制可用的诊断内容。

## Impact
- Affected specs: Monitor 可诊断性、复制诊断能力、无 IPC 时的用户体验。
- Affected code:
  - `src/renderer/src/pages/Monitor.tsx`

## MODIFIED Requirements
### Requirement: Poll Status Watchdog
当未收到轮询状态时，系统 SHALL 优先区分 “IPC 不可用（web mode）” 与 “IPC 断连/轮询未运行”，避免错误归因。

#### Scenario: Web mode
- **WHEN** `window.api` 或 `window.api.store` 不可用
- **THEN** 状态条显示 “IPC unavailable (web mode)” 且复制诊断可用

#### Scenario: IPC mode but stale
- **WHEN** IPC 可用但超过阈值未收到任何轮询事件
- **THEN** 状态条显示 “Polling not running / IPC disconnected” 且复制诊断可用

