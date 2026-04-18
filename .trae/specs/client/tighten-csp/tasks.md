# Tasks
- [x] Task 1: 收紧 `index.html` 的 CSP 规则 (`index.html`)
  - [x] SubTask 1.1: 移除 `connect-src *`，替换为 `connect-src 'self' https://qt.gtimg.cn https://smartbox.gtimg.cn ws://localhost:* ws://127.0.0.1:*`。
  - [x] SubTask 1.2: 移除 `script-src 'self' 'unsafe-inline'` 中的 `'unsafe-inline'`，将其精简为 `script-src 'self'`。
  - [x] SubTask 1.3: 保持 `style-src 'self' 'unsafe-inline'` 以确保 Ant Design 正常工作。
- [x] Task 2: 确保编译不报错 (`npm run typecheck:web`)。

# Task Dependencies
- [Task 2] depends on [Task 1]