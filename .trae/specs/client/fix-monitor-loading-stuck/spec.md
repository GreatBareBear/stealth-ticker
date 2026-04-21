# Fix Monitor Loading Stuck Spec

## Why
在首次启动或配置被清空时，股票行情界面一直显示 "Loading..."。这是由于主进程中的 `alertService` 仅通过读取 `store.get('stocks')` 决定是否拉取行情数据，当其未初始化时视为空数组从而停止拉取；而渲染进程 `Monitor.tsx` 却使用了内置的默认自选股数组渲染占位 UI 并在等待主进程推送数据，导致了数据不一致和永久等待加载。

## What Changes
- 在 `src/main/index.ts` 应用程序初始化阶段，若发现 `electron-store` 中没有 `stocks` 数据，则向其写入与 `StocksTab` 一致的默认自选股数组（包含上证指数、深证成指、平安银行、贵州茅台）。
- 同步了 `Monitor.tsx` 中使用的 `DEFAULT_STOCKS` 与 `main/index.ts` 的默认列表以保持完全一致。

## Impact
- Affected code: `src/main/index.ts`, `src/renderer/src/pages/Monitor.tsx`

## ADDED Requirements
### Requirement: Default Stocks Initialization
The system SHALL initialize `electron-store` with a default list of stocks if none exist upon startup.

#### Scenario: First Launch Success
- **WHEN** user launches the app for the first time
- **THEN** default stocks are populated in the store, and `alertService` correctly fetches and pushes stock data, resolving the "Loading..." state.