# Monitor Display Fixes Spec

## Why
用户反馈：
1. 添加自定义股票（如大写字母的代码）后，悬浮行情窗口能显示该股票但一直卡在 "Loading..."。这是由于在向 API 请求和解析响应时，没有统一进行大小写转换与兼容，导致前端按原输入查找不到对应的行情数据。
2. 当清空所有自选股票时，悬浮窗口并没有显示为空，而是恢复显示了 3 只默认股票。这是由于 `Monitor.tsx` 和主进程 `index.ts` 中对空数组的判断逻辑过于严格，当检测到无股票时强制加载了默认列表。

## What Changes
- **alertService.ts**:
  - 请求时将股票代码统一转为小写。
  - 解析 API 响应时，为 `newData` 对象生成大小写兼容的键值（如小写、大写以及原始键）。
  - 在内部检查警报时使用兼容键查找行情数据。
- **Monitor.tsx**:
  - 渲染股票时，在 `stockData` 中使用大小写兼容键查找行情数据。
  - 移除对空数组回退 `DEFAULT_STOCKS` 的逻辑，直接使用本地配置或空数组。
  - 删除文件内的 `DEFAULT_STOCKS` 常量定义。
- **main/index.ts**:
  - 移除初始化阶段对于“空数组”判定并回退插入默认股票的逻辑。如果是初次启动或数据损坏，仅初始化为空数组 `[]`。

## Impact
- Affected code:
  - `src/main/alertService.ts`
  - `src/renderer/src/pages/Monitor.tsx`
  - `src/main/index.ts`

## ADDED Requirements
### Requirement: Case-insensitive Stock Data Matching
The system SHALL correctly match and display stock data regardless of whether the user inputs the stock symbol in uppercase or lowercase.

#### Scenario: Success case
- **WHEN** user adds a custom stock with uppercase symbol (e.g., SH600519)
- **THEN** the monitor successfully fetches and displays the data instead of getting stuck on "Loading...".

## MODIFIED Requirements
### Requirement: Empty Monitor When No Stocks Set
The system SHALL display an empty monitor window if the user has not configured any stocks or has cleared their stock list, rather than reverting to a hardcoded list of default stocks.