# Tasks
- [x] Task 1: 修复 Settings 页面中的 ipcRenderer 和 store 空指针异常
  - [x] SubTask 1.1: 增加对 `window.electron?.ipcRenderer` 的安全访问
  - [x] SubTask 1.2: 增加对 `window.api?.store` 的安全访问
- [x] Task 2: 修复其他组件和页面的潜在空指针异常
  - [x] SubTask 2.1: 为 Monitor 中的 ipcRenderer 添加安全链式调用
  - [x] SubTask 2.2: 修复 AlertsTab 中 `window.api.store` 的直接访问
  - [x] SubTask 2.3: 修复 Versions.tsx 中的 process.versions 访问
  - [x] SubTask 2.4: 修复 ErrorBoundary 中的 store 访问