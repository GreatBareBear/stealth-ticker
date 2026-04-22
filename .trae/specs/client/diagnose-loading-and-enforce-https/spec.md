# Diagnose Loading and Enforce HTTPS Spec

## Why
用户反馈监控面板仍持续显示 “Loading...”，且已反复调整过 symbol 大小写、GBK 解码、轮询策略等实现仍未稳定恢复。当前系统在“主进程轮询失败 / 解析失败 / IPC 未送达 / 股票未被实际轮询”时，渲染层仅能表现为“无数据 → Loading...”，缺少可定位根因的状态信息，导致问题难以闭环。
同时用户要求所有访问外部接口的 HTTP 链接统一升级为 HTTPS。

## What Changes
- 监控面板增加“数据状态”能力：
  - 主进程在每次轮询结束后，向渲染进程推送结构化状态（成功/失败、失败原因、最近一次成功时间、最近一次请求 URL、轮询间隔等）。
  - 渲染进程在无行情数据时，不再永久显示单一 “Loading...”，而是根据状态展示“正在请求 / 最近失败原因 / 最近成功时间”，以便用户与开发者快速判定根因属于网络、解析或配置。
- HTTPS 统一化：
  - 将代码库中所有访问外部接口的 `http://` 链接统一替换为 `https://`（允许 `localhost/127.0.0.1` 继续使用 HTTP/WS）。
  - 对外部域名的 allowlist / CSP / CORS 规则保持与 HTTPS 一致，避免引入策略不一致导致的请求失败。

## Impact
- Affected specs: 行情拉取与展示可观测性、外部接口安全性（HTTPS）。
- Affected code:
  - `client/src/main/alertService.ts`
  - `client/src/main/index.ts`（如需补充 IPC 或 session/webRequest 规则）
  - `client/src/preload/index.ts`
  - `client/src/renderer/src/pages/Monitor.tsx`
  - 代码库内其他包含外部 `http://` 的位置（如有）

## ADDED Requirements
### Requirement: Stock Data Status Telemetry
The system SHALL expose stock polling and parsing status from the main process to the renderer so that “Loading...” can be differentiated into actionable states.

#### Scenario: Poll success
- **WHEN** the main process finishes a poll and parses at least one symbol successfully
- **THEN** the renderer receives a status event indicating success, including lastSuccessAt and symbolCount.

#### Scenario: Poll failure
- **WHEN** the main process poll fails due to network / timeout / abort / decode / parse errors
- **THEN** the renderer receives a status event indicating failure, including error type and message, and lastAttemptAt.

### Requirement: HTTPS Only for External Endpoints
The system SHALL use HTTPS for all external HTTP endpoints referenced in code (excluding localhost development endpoints).

#### Scenario: External URL usage
- **WHEN** the application makes requests to third-party services
- **THEN** the request URLs use `https://` and remain compatible with CSP/CORS allowlists.

