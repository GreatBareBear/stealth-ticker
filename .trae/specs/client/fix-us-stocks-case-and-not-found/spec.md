# Fix US Stocks Case Sensitivity and Invalid Symbol Display Spec

## Why
用户反馈监控面板部分股票仍显示 "Loading..."。
经过深入的底层测试与数据流诊断，发现：
1. 腾讯行情 API 对**美股代码具有严格的大小写敏感性**（如必须为 `usAAPL`，若使用 `usaapl` 则返回 `v_pv_none_match="1"`），而之前的版本为了满足“全部统一小写”的需求，错误地把美股也强制变成了小写，导致美股被服务器拒收。
2. 即使发生上述“无数据返回”的情况，由于 HTTP 请求本身是成功的（返回 200），主进程向渲染层推送了 `phase: 'success'` 状态。此时前端发现本地数据字典里找不到该股票数据，且状态不是 `'error'`，于是**继续无休止地显示 "Loading..."**。

## What Changes
- **alertService.ts**:
  - 在组装请求 `symbols` 时，恢复对美股（以 `us` 开头）的**大写转换**（如 `usAAPL`），以满足腾讯 API 的强制要求；其他市场（A股、港股等）维持小写。
  - 在解析完成数据后，校验本次请求的所有 `symbols` 是否在返回结果 `newData` 中都有对应的数据。如果某只股票没有返回数据（例如代码错误、退市等），将其标记为一个特殊的占位对象（如 `{ error: 'Not Found' }`）。
- **Monitor.tsx**:
  - 在渲染单只股票时，如果发现其在 `stockData` 中的数据包含 `error: 'Not Found'` 标记，直接在界面显示 `Invalid Symbol / Not Found`，彻底终结 "Loading..."。

## Impact
- Affected specs: 行情数据获取（美股支持）、前端展示可观测性。
- Affected code:
  - `src/main/alertService.ts`
  - `src/renderer/src/pages/Monitor.tsx`

## ADDED Requirements
### Requirement: US Stock Case Compliance
The system SHALL format US stock symbols to uppercase after the 'us' prefix (e.g., `usAAPL`) before querying the Tencent API, ensuring they are correctly resolved by the server.

### Requirement: Unmatched Symbol Identification
The system SHALL identify requested symbols that yield no data from the API and mark them as invalid, displaying a clear "Not Found" message to the user rather than hanging indefinitely on "Loading...".

#### Scenario: User adds an invalid or wrongly-cased US stock
- **WHEN** the backend requests a stock and the API returns no data for it
- **THEN** the UI explicitly shows "Not Found" for that specific stock instead of "Loading...".