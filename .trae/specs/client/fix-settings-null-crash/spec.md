# Fix Settings Null Crash Spec

## Why
在开发环境下直接通过浏览器访问或某些 Electron 渲染进程上下文中 `window.electron` 或 `window.api` 对象未注入或加载延迟，导致尝试访问其属性（如 `ipcRenderer` 或 `store`）时抛出 `TypeError: Cannot read properties of undefined` 从而引发 React 白屏崩溃。

## What Changes
- 全局增加了对 `window.electron` 和 `window.api` 访问的 Optional Chaining (`?.`) 安全调用。
- 在未获取到有效的 `store` 时提供了后备默认对象（如 `get: async () => null`）。

## Impact
- Affected code: `src/renderer/src/pages/Settings.tsx`, `src/renderer/src/pages/Monitor.tsx`, `src/renderer/src/components/settings/AlertsTab.tsx`, `src/renderer/src/components/Versions.tsx`, `src/renderer/src/ErrorBoundary.tsx`.

## ADDED Requirements
### Requirement: Null Safety for Electron APIs
The system SHALL gracefully handle situations where Electron preload APIs (`window.electron`, `window.api`) are missing.

#### Scenario: Missing API Graceful Degradation
- **WHEN** React components mount and attempt to access `ipcRenderer` or `store`
- **THEN** The code should use optional chaining and fallback defaults to prevent a rendering crash.