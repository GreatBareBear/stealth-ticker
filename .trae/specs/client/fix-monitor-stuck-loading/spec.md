# Fix Monitor Stuck Loading Spec

## Why
用户反馈：即使在之前修复了大小写和空数组回退逻辑后，添加特定股票（如中国石油）仍然显示 "Loading..."。
经过深度排查，导致此问题的根因是多重边缘情况的叠加：
1. **编码与特殊字符异常**：若本地存储的股票代码含有未转义字符或前后空格，Node.js `net.request` 会抛出异常或请求失败。
2. **解码异常导致轮询中断**：部分用户的 Electron 环境可能缺少完整的 ICU 数据，导致 `new TextDecoder('gbk')` 抛出错误。由于该异常未被捕获，整个后台行情轮询服务（AlertService）会彻底崩溃并永久停止拉取数据。
3. **API 字段长度校验过严**：部分市场（如美股）或特定指数返回的字段数少于 35 个，导致被解析逻辑误判丢弃。
4. **无前缀代码的映射丢失**：若用户历史配置中存有无前缀的纯数字代码（如 `601857`），API 返回的数据带有前缀（`v_sh601857`），渲染端按 `601857` 查找时会命中 `undefined`。

## What Changes
- **alertService.ts**:
  - 请求时对股票代码增加 `trim()` 和 `encodeURIComponent`，防止非法字符导致请求崩溃。
  - 在 `response.on('end')` 中增加 `try-catch-finally`，确保即使 GBK 解码失败（降级到 utf8），`scheduleNextPoll()` 也会在 `finally` 中被调用，保证轮询永不中断。
  - 将解析时的字段长度校验从 `> 34` 放宽到 `> 10`。
  - 解析逻辑增加对纯数字代码（`parts[2]`）的映射，使得无前缀的 `601857` 也能匹配到数据。
  - 正则匹配放宽，允许响应行末尾没有分号（`;?`）。
- **Monitor.tsx**:
  - 前端渲染取值时强制执行 `trim()`，防止因多余空格导致的匹配失败。

## Impact
- Affected code:
  - `src/main/alertService.ts`
  - `src/renderer/src/pages/Monitor.tsx`

## ADDED Requirements
### Requirement: Resilient Polling & Parsing
The system SHALL continuously poll for stock data even if string decoding fails, and SHALL correctly match API responses to locally stored stock symbols regardless of missing market prefixes, trailing spaces, or fewer returned fields.

#### Scenario: Success case
- **WHEN** user adds a stock with a pure numeric symbol, or the network response encounters decoding issues
- **THEN** the system falls back gracefully, maps the numeric code correctly, and the monitor successfully displays the stock price instead of getting stuck on "Loading...".