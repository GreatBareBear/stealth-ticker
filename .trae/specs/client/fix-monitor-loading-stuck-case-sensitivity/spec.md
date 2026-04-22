# Fix Monitor Loading Stuck Spec

## Why
用户反馈：即使在处理了大量的边界情况后，"Loading..." 问题依然存在。
经过深入的根因排查，发现腾讯行情 API 对**美股代码具有严格的大小写敏感性**（例如 `usAAPL` 正常返回，而 `usaapl` 会返回报错 `v_pv_none_match="1"`，A股和港股则必须是全小写）。
之前为了统一处理空格引入了 `.toLowerCase()` 操作，以及设置面板搜索美股时直接拼接了小写的代码（如 `usaapl`），导致所有美股或大小写异常的股票代码在请求时被腾讯 API 拒绝，从而在前端永远卡在 "Loading..." 状态。

## What Changes
- **alertService.ts**:
  - 在组装请求 `symbols` 时，引入严格的**分市场大小写格式化策略**：
    - 如果是美股（以 `us` 开头），强制格式化为 `us` + 大写字母（如 `usAAPL`）。
    - 如果是 A 股或港股（`sh`/`sz`/`hk`/`bj` 等），强制格式化为全小写（如 `sh601857`）。
- **StocksTab.tsx**:
  - 在搜索下拉框解析 SmartBox 数据时，对于 `us` 市场的股票，提取代码后立即调用 `.toUpperCase()`，确保保存到配置中的就是标准的 `usAAPL` 格式。

## Impact
- Affected code:
  - `src/main/alertService.ts`
  - `src/renderer/src/components/settings/StocksTab.tsx`

## ADDED Requirements
### Requirement: Strict API Case Sensitivity Handling
The system SHALL strictly format stock symbols according to the target market's case sensitivity rules before querying the Tencent Stock API, ensuring no valid stocks are rejected due to case mismatch.

#### Scenario: Success case
- **WHEN** user adds a US stock (e.g. Apple) or enters an incorrectly cased symbol (e.g. `usaapl`, `SH601857`)
- **THEN** the system automatically normalizes it to `usAAPL` or `sh601857` and successfully fetches the real-time data, resolving the infinite "Loading..." state.