# Remove Monitor Diagnostics Spec

## Why
用户认为当前增加的各种状态条、诊断代码和复制按钮干扰了界面的整洁度，并且认为当前方案无法彻底解决问题。按照用户的明确要求，我们需要去掉所有相关的测试、调试代码和附属的诊断UI，让代码回归纯净状态。

## What Changes
- **Monitor.tsx**:
  - 移除顶部增加的 “Polling Status” 状态条容器。
  - 移除 “复制诊断” 按钮及其对应的 `copyDiagnostics` 处理函数。
  - 移除 `watchdogStale`、`pollAgeMs`、`ipcAvailable`、`storeAvailable` 等所有相关的看门狗（watchdog）逻辑。
  - 恢复列表中的纯 "Loading..." 逻辑，移除类似 "IPC unavailable" 等状态显示。
- **main/alertService.ts & index.ts**:
  - 移除为了诊断而补充的 `statusCode`、`bytes` 等字段，以及 `lastPollStatus` 的缓存机制和 `emitPollStatus`。
  - 移除 `get-stock-poll-status` 和 `copy-to-clipboard` IPC handler。
- **preload/index.ts & Types**:
  - 移除暴露给渲染进程的 `getStockPollStatus`、`onStockPollStatus`、`offStockPollStatus` 以及 `copyToClipboard`。
  - 移除 `StockPollStatus` 和 `StockPollPhase` 类型定义。

## Impact
- Affected specs: 状态监控与可观测性。
- Affected code:
  - `src/renderer/src/pages/Monitor.tsx`
  - `src/main/alertService.ts`
  - `src/main/index.ts`
  - `src/preload/index.ts`
  - `src/preload/index.d.ts`
  - `src/renderer/src/env.d.ts`

## REMOVED Requirements
### Requirement: Polling Diagnostics UI
**Reason**: 用户明确要求移除无用的调试和测试代码（包含复制按钮）。
**Migration**: 彻底删除相关组件、状态变量和 IPC 通信接口，保持界面原本的简洁状态。