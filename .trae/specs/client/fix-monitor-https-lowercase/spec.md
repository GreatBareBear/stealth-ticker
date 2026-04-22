# Fix Monitor HTTPS and Lowercase Spec

## Why
用户指出测试地址 `https://qt.gtimg.cn/q=sh600519` 在浏览器中是有返回数据的，并且期望股票代码统一使用小写。
之前为了规避某些请求问题降级到了 HTTP，且针对美股进行了强制大写转换。既然明确用户期望恢复 HTTPS 并全部统一使用小写代码来获取行情数据，我们应该简化格式化逻辑并更新请求地址，以符合用户的期望，解决“Loading”问题。

## What Changes
- **alertService.ts**:
  - 简化 `symbols` 的格式化逻辑，移除对于美股（`us`）的强制大写转换，所有代码统一调用 `.toLowerCase()` 转换为全小写。
  - 将行情数据的请求地址从 `http://qt.gtimg.cn/q=${symbols}` 升级恢复为 `https://qt.gtimg.cn/q=${symbols}`。
- **StocksTab.tsx**:
  - 移除对美股搜索结果（`exchange === 'us'`）代码部分的 `.toUpperCase()` 处理。
  - 确保保存和展示的所有股票代码均为统一的小写格式。

## Impact
- Affected code:
  - `src/main/alertService.ts`
  - `src/renderer/src/components/settings/StocksTab.tsx`

## ADDED Requirements
### Requirement: Unified Lowercase Symbols and HTTPS Polling
The system SHALL format all stock symbols to strictly lowercase regardless of the market, and it SHALL fetch stock data using the secure HTTPS protocol (`https://qt.gtimg.cn/q={symbols}`).

#### Scenario: Success case
- **WHEN** user adds a stock or the background service polls for updates
- **THEN** the stock symbol is formatted as purely lowercase (e.g. `sh600519`, `usaapl`), the request is sent securely over HTTPS, and the data is successfully fetched and displayed without getting stuck on "Loading...".