# Tasks

- [x] Task 1: 修改渲染层入口 HTML 标题
  - [x] SubTask 1.1: 在 `client/src/renderer/index.html` 中，将 `<title>Electron</title>` 修改为 `<title>设置</title>`。

- [x] Task 2: 为设置窗口明确传递图标参数
  - [x] SubTask 2.1: 在 `client/src/main/index.ts` 中的 `openSettings` 函数里，找到 `settingsWindow = new BrowserWindow({...})`。
  - [x] SubTask 2.2: 将 `...(process.platform === 'linux' ? { icon } : {})` 修改为 `icon: icon`（或 `icon`），确保所有系统平台（包括 Windows）的窗口标题栏和任务栏都能正确渲染并读取该图标。

# Task Dependencies
- [Task 1] 与 [Task 2] 可以并行处理。