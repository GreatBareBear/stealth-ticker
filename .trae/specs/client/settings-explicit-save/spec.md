# Explicit Settings Save Spec

## Why
当前设置界面的所有的配置更改都是即时保存（Auto-save）的。当用户想要取消刚刚的修改时，无法直接丢弃，并且直接关闭窗口也会保留这些“未确认”的变更，这不符合企业级桌面软件“确定/取消”的标准操作心智。我们需要将即时保存修改为显式的确认保存，并在点击“取消”或直接关闭窗口时放弃变更。

## What Changes
- **引入显式保存交互**：在 `Settings.tsx` 页面底部增加全局的“确定”与“取消”按钮。
- **全局拦截 Store I/O**：在 `Settings.tsx` 中建立针对 `window.api.store` 的透明代理拦截层（Mock Store）。所有的读写操作在点击“确定”前都会被截获并暂存在内存中（Draft State），子组件的 `store.set` 和 `store.get` 都是对这个内存草稿进行操作。
- **确认与丢弃逻辑**：
  - 点击“确定”：将内存中暂存的所有变更一次性 flush 写入到底层的 Electron Store 中，并发送 IPC 关闭窗口。
  - 点击“取消”或点右上角关闭（触发 `settings-closed`）：清空内存草稿，发送 IPC 关闭窗口。
  - 窗口重新打开（触发 `settings-shown`）：清空草稿，并通过更改 `React Key` 强制重置/重新挂载所有 Tabs，保证重新拉取真实的配置。
- **企业级 IPC 封装**：避免在渲染进程直接依赖 `window.electron.ipcRenderer`（可能不存在或被安全策略裁剪），改为在 `preload` 中通过 `window.api.closeSettingsWindow()` 暴露受控的关闭能力，并由主进程统一处理隐藏窗口逻辑。
- **优化原并发修复逻辑**：将 `AdvancedTab` 和 `DisplayTab` 之前使用的基于本地 `settingsRef` 的并发锁，升级为从拦截后的 Mock Store 获取最新值，以完美兼容多 Tab 间的合并逻辑。

## Impact
- Affected specs: 设置页保存行为、UI 布局
- Affected code:
  - `client/src/main/index.ts`
  - `client/src/renderer/src/pages/Settings.tsx`
  - `client/src/renderer/src/components/settings/AdvancedTab.tsx`
  - `client/src/renderer/src/components/settings/DisplayTab.tsx`

## ADDED Requirements
### Requirement: 显式保存设置
The system SHALL provide 显式地确认机制以保存设置。

#### Scenario: Success case
- **WHEN** 用户在设置页修改了任何选项
- **THEN** 修改只在内存中生效。
- **WHEN** 用户点击底部的“确定”按钮
- **THEN** 所有修改被保存，并且窗口关闭。
- **WHEN** 用户点击“取消”按钮或关闭窗口
- **THEN** 所有修改被丢弃，并在下次打开设置时还原为原有状态。

#### Scenario: IPC API 不可用时的降级
- **WHEN** 渲染进程环境中 `window.electron` 或 `window.electron.ipcRenderer` 不存在/不可用
- **THEN** “确定/取消”仍能通过 `window.api.closeSettingsWindow()` 正常关闭设置窗口，且不触发白屏或未处理异常。
