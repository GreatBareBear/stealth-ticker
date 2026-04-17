# IPC Store Whitelist and Validation Spec

## Why
目前应用使用 `electron-store` 进行本地持久化，通过 IPC（`store:get`、`store:set`、`store:delete`）将存储能力暴露给渲染进程。但当前实现没有对键名（key）或键值（value）进行任何限制。这导致渲染进程若受到 XSS 攻击或发生异常，能够随意读取、写入或删除任意本地配置文件数据，甚至写入超大体积的异常对象导致持久化文件损坏、应用崩溃或被恶意利用。

## What Changes
- 在主进程（`main/index.ts`）的 `store:set`、`store:get` 和 `store:delete` 处理函数中引入**键名白名单（Key Whitelist）**机制。
- **白名单列表**：仅允许目前应用实际使用的 key，如：`settings`, `stocks`, `alerts`, `alertsGlobalPaused`, `alertsTempPausedUntil`, `alertsDndEnabled`, `alertsDndStart`, `alertsDndEnd`, `alertsDndAllowedMethods`, `chartSettings`, `otherSettings`, `dashboard`。
- **载荷限制与基本校验**：在 `store:set` 中对传入的 value 进行体积限制（例如序列化后不超过 5MB），防止被写入恶意超大对象导致磁盘空间耗尽或 JSON 解析崩溃。

## Impact
- Affected specs: IPC Store 读写安全。
- Affected code: `client/src/main/index.ts`

## ADDED Requirements
### Requirement: IPC Store 安全防护
系统 SHALL 限制渲染进程对本地存储的操作权限：
- **WHEN** 渲染进程发起 `store:set` / `store:get` / `store:delete`
- **THEN** 主进程必须检查 key 是否在允许的白名单内。
- **AND** 若不在白名单内，主进程直接拒绝操作并抛出错误/返回 null。
- **AND** 在 `store:set` 时，必须确保 value 能够被安全序列化且体积未超过合理阈值（如 5MB）。
