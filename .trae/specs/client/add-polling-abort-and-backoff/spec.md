# Add Polling Abort and Backoff Strategy Spec

## Why
目前行情轮询机制（通过 `setInterval`）缺少对网络异常情况的处理。当网络拥堵或断网时，请求可能会堆积（如果请求没有被及时清理），进而导致恢复网络瞬间大量并发请求引发问题。
引入超时（Timeout/Abort）机制和错误退避（Backoff）策略可以保证：
1. 单个请求不会无限期挂起。
2. 在连续失败时，不会过于频繁地进行无效请求（浪费 CPU 和系统网络资源）。

## What Changes
- **请求超时控制**：在主进程的 `alertService.ts` 中发起行情请求（`net.request`）时，加入超时中断逻辑。如果请求在规定时间（例如 5 秒）内没有响应，则中止该请求。
- **指数退避策略 (Exponential Backoff)**：
  - 当请求失败或超时时，记录连续失败次数（`consecutiveFailures`）。
  - 下一次轮询的时间间隔将基于失败次数动态延长（例如：正常的 `refreshRate` 秒，失败后变为 `refreshRate * (2 ^ consecutiveFailures)`，并设定最大上限如 60 秒）。
  - 一旦请求成功，将 `consecutiveFailures` 重置为 0，并恢复正常的 `refreshRate` 轮询。
- **改用动态定时器**：为了支持动态改变下一次轮询的间隔时间，将原有的 `setInterval` 改为使用 `setTimeout` 的递归调用模式。

## Impact
- Affected specs: 行情轮询机制。
- Affected code: `client/src/main/alertService.ts`

## MODIFIED Requirements
### Requirement: 健壮的网络轮询
行情数据获取 SHALL 在网络异常时具备自我保护机制：
- **WHEN** 行情请求超过设定时间未响应
- **THEN** 系统必须主动中止该请求，避免资源泄漏。
- **WHEN** 行情请求发生错误（如断网或超时）
- **THEN** 下一次发起请求的间隔时间必须逐步延长（指数退避），直至达到上限。
- **WHEN** 行情请求成功恢复
- **THEN** 轮询间隔时间必须立刻恢复为用户设定的刷新频率。