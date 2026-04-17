# Tasks
- [x] Task 1: 修复主窗口 (MainWindow) 的安全配置 (`index.ts`)
  - [x] SubTask 1.1: 移除 `webPreferences` 中的 `sandbox: false`。
  - [x] SubTask 1.2: 移除 `webPreferences` 中的 `webSecurity: false`。
  - [x] SubTask 1.3: 显式添加 `contextIsolation: true` 和 `nodeIntegration: false`。
- [x] Task 2: 修复设置窗口 (SettingsWindow) 的安全配置 (`index.ts`)
  - [x] SubTask 2.1: 移除 `webPreferences` 中的 `sandbox: false`。
  - [x] SubTask 2.2: 移除 `webPreferences` 中的 `webSecurity: false`。
  - [x] SubTask 2.3: 显式添加 `contextIsolation: true` 和 `nodeIntegration: false`。
- [x] Task 3: 修复关于窗口 (AboutWindow) 的安全配置 (`index.ts`)
  - [x] SubTask 3.1: 移除 `webPreferences` 中的 `sandbox: false`。
  - [x] SubTask 3.2: 移除 `webPreferences` 中的 `webSecurity: false`。
  - [x] SubTask 3.3: 显式添加 `contextIsolation: true` 和 `nodeIntegration: false`。
- [x] Task 4: 处理渲染进程的跨域问题 (`index.ts`)
  - [x] SubTask 4.1: 在主进程中拦截渲染进程对 `https://qt.gtimg.cn` 和 `https://smartbox.gtimg.cn` 的请求，并在响应头中添加 `Access-Control-Allow-Origin: *`，以确保开启 `webSecurity` 后渲染进程的 Fetch 请求不会因为 CORS 被拦截。
- [x] Task 5: 确保编译不报错 (`npm run typecheck:main`)。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
