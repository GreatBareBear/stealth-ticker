# Tasks

- [x] Task 1: 实现“锁定面板”与鼠标穿透功能
  - [x] SubTask 1.1: 在 `client/src/main/index.ts` 的托盘菜单中增加“锁定面板” (type: 'checkbox', checked: false) 菜单项。
  - [x] SubTask 1.2: 当勾选状态改变时，调用 `mainWindow?.setIgnoreMouseEvents(locked, { forward: true })` 实现真正的鼠标穿透（确保 Windows 上正常）。
  - [x] SubTask 1.3: 通过 IPC 将锁定状态同步给渲染进程 `Monitor.tsx`，以便它在锁定状态时移除拖拽控制（或在视觉上予以区分）。

- [x] Task 2: 优化“老板键”隐藏时的后台性能
  - [x] SubTask 2.1: 在主进程 `client/src/main/index.ts` 中，当执行老板键触发 `mainWindow.hide()` 时，通过 IPC 向渲染进程发送 `window-hidden` 事件；执行 `show()` 时发送 `window-shown` 事件。
  - [x] SubTask 2.2: 在 `client/src/renderer/src/pages/Monitor.tsx` 中监听这些事件。当窗口隐藏时，暂停定时器或将刷新频率降低；当重新显示时，立即触发一次数据请求并恢复用户设置的刷新频率。

- [x] Task 3: 优化设置页与关于页 UI
  - [x] SubTask 3.1: 修改 `client/src/renderer/src/pages/Settings.tsx`，移除底部的“取消”和“确定”按钮所在的整个 `<div style={{... flexShrink: 0 }}>` 区域，因为配置早已在 Tabs 中实时保存。
  - [x] SubTask 3.2: 修改 `client/src/renderer/src/pages/About.tsx`，将 Home、E-mail 等信息的 `Input` 替换为 `Typography.Text`，添加 `copyable` 属性以支持一键复制，或直接使用可点击的外部链接。

# Task Dependencies
- [Task 1], [Task 2], [Task 3] 相互独立，可分别独立实现并测试。